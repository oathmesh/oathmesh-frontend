<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your
training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:oathmesh-agent-rules -->
# OathMesh-Specific Agent Rules

## Critical Protocol Traps

These patterns look standard but are **WRONG** for this codebase. Each will either silently
break token verification or introduce a security regression.

### ❌ Using `Bearer` instead of `OathMesh` in the Authorization header

```diff
- Authorization: Bearer <token>
+ Authorization: OathMesh <token>
```

`Bearer` is accepted by the verifier for legacy compatibility, but new code in this repo
MUST use the `OathMesh` scheme. Middleware, tests, and examples must reflect this.

### ❌ Using `RS256` or `HS256` as the signing algorithm

The OathMesh verifier allowlist is `EdDSA` (primary) and `ES256` (compatibility only).
`RS256`, `HS256`, and `alg: none` are **rejected at Step 02** of the 14-step pipeline.
Never configure or suggest these algorithms.

### ❌ Setting TTL > 300 seconds

The issuer hard-clamps TTL to `max(1, min(hint, 300))`. No token in the wild can live longer
than 300 seconds. Never set `expires_in`, `exp`, or any TTL hint above 300 in code or docs.

### ❌ Using a generic JWT library for verification

This codebase uses `@oathmesh/oathmesh/next` (`withOathMesh`), not `jsonwebtoken`, `jose`,
or `next-auth`. Generic JWT libraries do not implement the 14-step OathMesh pipeline and
will skip replay protection (Step 13) and policy evaluation (Step 14).

### ❌ Reading `process.env` directly

All environment access MUST go through `lib/env.ts`. The Zod schema there validates at
server startup and fails hard if required vars are missing. Direct `process.env` access
bypasses this and can lead to silent `undefined` values in production.

### ❌ Logging raw Oath Tokens

Tokens are bearer credentials. Log `jti` (UUID v4, available as `caller.tokenId`) instead.
The `jti` is sufficient for audit correlation and replay investigation.

### ❌ Using `typ: jwt` instead of `typ: om+jwt`

The `typ` header MUST be `om+jwt`. The verifier rejects any token with a different `typ`
at Step 02. If you are constructing test tokens manually, verify this field.

---

## Filesystem Map

```
app/
  api/
    contact/route.ts       → POST: Resend email dispatch, rate-limited
    donate/route.ts        → POST: Stripe Checkout session
    donate/webhook/        → POST: Stripe webhook (signature verified by Stripe SDK)
    health/route.ts        → GET: liveness check
    subscribe/route.ts     → POST: email subscription (rate-limited)
    wishlist/route.ts      → GET/POST: wishlist items + anonymous voting
  docs/                    → static protocol documentation pages
  donate/                  → Stripe donation UI (client + server components)
  wishlist/                → community feature wishlist UI
  globals.css              → Tailwind v4 global styles
  layout.tsx               → root layout (fonts, metadata, Framer Motion provider)
  page.tsx                 → landing page

components/                → shared React components (no sub-routing)
db/
  index.ts                 → Drizzle client singleton (Vercel Postgres)
  schema.ts                → table definitions: wishlist_items, wishlist_votes,
                             donations, subscribers, contact_messages
  seed.ts                  → deterministic seed script for local dev
lib/
  env.ts                   → Zod-validated env schema — ONLY way to access env vars
  rate-limit.ts            → Upstash KV sliding-window rate limiter
  resend.ts                → Resend email client + template dispatch helpers
  stripe.ts                → Stripe client + Checkout session helpers
  utils.ts                 → cn(), formatDate(), and other pure utilities
emails/                    → React Email templates (rendered by Resend)
tests/                     → Playwright E2E test suites
public/                    → static assets (images, icons)
```

---

## Database Schema Guide (Drizzle + PostgreSQL)

- All tables use `uuid().defaultRandom().primaryKey()` — never `serial` or `bigserial`.
- Timestamps are `timestamp` (no timezone stored, UTC by convention).
- Always use `$inferSelect` / `$inferInsert` for TypeScript types — never write raw interfaces.
- Index naming convention: `{table}_{column}_idx`.
- Unique constraint naming: `{table}_{column}_uniq`.
- Run migrations with `npm run db:generate && npm run db:push` (Drizzle Kit push, not migrate).

### Tables

| Table              | Purpose                                          |
|--------------------|--------------------------------------------------|
| `wishlist_items`   | Community feature requests with status + votes   |
| `wishlist_votes`   | One vote per `(item_id, voter_fingerprint)`; fingerprint = SHA-256 of IP+UA |
| `donations`        | Stripe-sourced donation records                  |
| `subscribers`      | Newsletter email list                            |
| `contact_messages` | Inbound contact form submissions                 |

---

## How to Add a New Protected API Route

If the route must verify Oath Tokens (e.g., an agent management endpoint):

1. **Install SDK** (if not yet installed):
   ```bash
   npm install @oathmesh/oathmesh
   ```

2. **Add env vars** to `lib/env.ts` Zod schema:
   ```typescript
   OATHMESH_AUDIENCE: z.string().url(),
   OATHMESH_TRUSTED_ISSUERS: z.string().min(1),
   ```
   And add them to `.env.local.example`.

3. **Create the route file** at `app/api/<name>/route.ts`:
   ```typescript
   import { withOathMesh } from '@oathmesh/oathmesh/next';
   import { NextRequest, NextResponse } from 'next/server';
   import { env } from '@/lib/env';

   const oathmesh = withOathMesh({
     audience: env.OATHMESH_AUDIENCE,
     trustedIssuers: env.OATHMESH_TRUSTED_ISSUERS.split(','),
   });

   export async function GET(request: NextRequest) {
     const { caller, error } = await oathmesh(request);
     if (error) return error; // structured 401

     // Safe to use: caller.principal.subject, caller.action, caller.tokenId
     return NextResponse.json({ ok: true });
   }
   ```

4. **Write a unit test** in `tests/` (Vitest) asserting 401 on missing/invalid token.

5. **Never add `if (dev) skip verification`** — test with real minted tokens using the CLI:
   ```bash
   TOKEN=$(./bin/oathmesh mint \
     --sub "agent://repo/acme/deploy-bot" \
     --aud "https://oathmesh.dev/api" \
     --act "read" --quiet)
   curl -H "Authorization: OathMesh $TOKEN" http://localhost:3000/api/<name>
   ```

---

## Running Tests

```bash
npm run test          # Vitest unit tests
npm run test:watch    # Vitest in watch mode (re-runs on save)
npm run test:e2e      # Playwright E2E (requires `npm run dev` in another terminal)
npm run typecheck     # TypeScript check only (tsc --noEmit)
```

---

## Common Failure Modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `❌ Invalid environment variables` on startup | Missing required env var | Copy `.env.local.example` → `.env.local`, fill all required values |
| 401 `step=2` from verifier | Wrong `typ` or disallowed `alg` | Ensure token has `typ: om+jwt` and `alg: EdDSA` |
| 401 `step=8` from verifier | Token expired | Mint a fresh token; max TTL is 300 s |
| 401 `step=10` from verifier | `aud` mismatch | `OATHMESH_AUDIENCE` env var must exactly match token's `aud` claim |
| 401 `step=13` from verifier | Replayed `jti` | Each token use is one-shot; never reuse a token |
| Drizzle schema drift | Migration not applied | Run `npm run db:generate && npm run db:push` |
| Rate limit 429 on `/api/*` | Upstash KV exhausted | Check `KV_REST_API_URL` / `KV_REST_API_TOKEN` in env |
<!-- END:oathmesh-agent-rules -->
