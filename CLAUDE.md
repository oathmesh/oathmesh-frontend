@AGENTS.md

# OathMesh Frontend — Claude Code Guidance

OathMesh is a short-lived signed machine-identity protocol. Oath Tokens are compact JWS tokens
(`typ: om+jwt`, `alg: EdDSA`) that expire in ≤ 300 seconds and carry a scoped, auditable caller
identity. This repository (`oathmesh-frontend`) is the **marketing + command-centre SaaS** for the
protocol: landing page, agent/key management dashboard, Stripe donations, feature wishlist, and
email subscriptions. The backend protocol implementation lives at
<https://github.com/oathmesh/oathmesh> (Go, v1.0.5).

---

## OathMesh Integration Map

```
app/
├── api/
│   ├── contact/route.ts      → public POST — Resend email, rate-limited via Upstash KV
│   ├── donate/route.ts       → public POST — Stripe Checkout session creation
│   ├── donate/webhook/       → public POST — Stripe webhook (signature verified)
│   ├── health/route.ts       → public GET  — liveness probe
│   ├── subscribe/route.ts    → public POST — newsletter signup (rate-limited)
│   └── wishlist/route.ts     → public GET/POST — wishlist CRUD + voting
├── docs/                     → static marketing docs pages (no auth)
├── donate/                   → Stripe donation UI
└── wishlist/                 → community wishlist UI
```

**No route in this repo currently calls `withOathMesh` or verifies Oath Tokens.** The dashboard
is a marketing + community platform; authentication is handled at the Vercel Edge/KV layer via
rate limiting. If you are adding a protected API route that **should** verify Oath Tokens (e.g.,
a future agent management endpoint), follow the pattern below exactly.

### Adding an OathMesh-Protected Route (App Router)

```typescript
// app/api/agents/route.ts
import { withOathMesh } from '@oathmesh/oathmesh/next';
import { NextRequest, NextResponse } from 'next/server';

// Initialize once at module scope — reads env at import time.
const oathmesh = withOathMesh({
  audience: process.env.OATHMESH_AUDIENCE!,         // e.g. "https://oathmesh.dev/api"
  trustedIssuers: process.env.OATHMESH_TRUSTED_ISSUERS!.split(','),
  // issuerUrl is derived automatically from the token's `iss` claim + /.well-known/jwks
});

export async function GET(request: NextRequest) {
  const { caller, error } = await oathmesh(request);
  if (error) return error; // 401 with OathMesh error taxonomy code

  // caller.principal.subject  → e.g. "agent://repo/acme/deploy-bot"
  // caller.action             → value of `act` claim
  // caller.tokenId            → jti (UUID v4)
  return NextResponse.json({ subject: caller.principal.subject });
}
```

The `@oathmesh/oathmesh` package is NOT yet in `package.json`. Install it before use:
```bash
npm install @oathmesh/oathmesh
```

---

## Token Facts Cheat-Sheet

| Property         | Value                                              |
|------------------|----------------------------------------------------|
| Format           | Compact JWS — 3 base64url segments separated by `.` |
| `typ` header     | `om+jwt`                                           |
| `alg` header     | `EdDSA` (primary); `ES256` accepted for compat     |
| `kid` format     | `issuer-key-YYYY-MM`                               |
| Rejected algs    | `none`, `HS256`, `RS256` with keys < 2048 bits     |
| Max TTL          | **300 seconds** — hard-clamped by the issuer       |
| HTTP header      | `Authorization: OathMesh <token>`                  |
| Compat header    | `Authorization: Bearer <token>` (discouraged)      |
| Required claims  | `iss`, `sub`, `aud`, `act`, `iat`, `exp`, `jti`    |
| Optional claims  | `scope`, `reason`, `src`, `delegated_by`, `env`, `tenant`, `rqh` |
| `jti`            | UUID v4, globally unique — enables replay protection |
| `rqh`            | `sha256` of HTTP request fields (request hash binding) |
| Signing          | Ed25519 (`crypto/ed25519` — zero third-party deps) |

---

## Environment Variables

All env validation runs server-side via `lib/env.ts` (Zod schema). Import `env` from there;
never read `process.env` directly in app code.

### Required

| Variable                   | Description                                               |
|----------------------------|-----------------------------------------------------------|
| `POSTGRES_URL`             | Pooled PostgreSQL connection string (Vercel Postgres)     |
| `STRIPE_SECRET_KEY`        | Stripe server-side key (`sk_test_…` / `sk_live_…`)       |
| `STRIPE_PUBLISHABLE_KEY`   | Stripe client-side key (`pk_test_…` / `pk_live_…`)       |
| `STRIPE_WEBHOOK_SECRET`    | Stripe webhook signing secret (`whsec_…`)                 |
| `RESEND_API_KEY`           | Resend transactional email key (`re_…`)                   |

### Optional / Defaulted

| Variable                       | Default                           | Description                           |
|--------------------------------|-----------------------------------|---------------------------------------|
| `POSTGRES_URL_NON_POOLING`     | —                                 | Non-pooled URL for migrations         |
| `KV_REST_API_URL`              | —                                 | Upstash KV REST URL (rate limiting)   |
| `KV_REST_API_TOKEN`            | —                                 | Upstash KV REST token                 |
| `STRIPE_DONATION_PRICE_ID`     | —                                 | Fixed-amount tier price ID            |
| `RESEND_FROM_EMAIL`            | `noreply@oathmesh.dev`            | Sender address                        |
| `RESEND_REPLY_TO`              | `team@oathmesh.dev`               | Reply-to address                      |
| `NEXT_PUBLIC_APP_URL`          | `http://localhost:3000`           | Public app origin                     |
| `NEXT_PUBLIC_GITHUB_URL`       | `https://github.com/oathmesh/oathmesh` | Backend repo link             |
| `NEXT_PUBLIC_POSTHOG_KEY`      | —                                 | PostHog analytics key                 |
| `NEXT_PUBLIC_POSTHOG_HOST`     | —                                 | PostHog host URL                      |

### If Adding OathMesh Token Verification

| Variable                       | Description                                           |
|--------------------------------|-------------------------------------------------------|
| `OATHMESH_AUDIENCE`            | `aud` claim value this service expects                |
| `OATHMESH_TRUSTED_ISSUERS`     | Comma-separated list of trusted issuer URLs           |

---

## Verification Pipeline (14 Steps, Fail-Closed)

The backend verifier (`internal/verify/`) rejects a token at the **first** failed step and
returns a 401 with an error taxonomy code containing the step number (1–14).

```
[01] Parse structure (must have 3 segments)
[02] Validate header: typ=om+jwt, alg on allowlist (EdDSA | ES256), reject alg=none
[03] Decode payload, extract iss
[04] Check iss against trusted-issuers list
[05] Load JWKS (cached, from {iss}/.well-known/jwks or mapped endpoint)
[06] Verify JWS signature (Ed25519) + alg confusion check
[07] Re-verify iss after signature check
[08] Check exp (+ 10 s clock skew)
[09] Check iat / nbf (must not be in the future, 10 s skew)
[10] Check aud (exact string match)
[11] Check all required claims present
[12] Verify rqh binding (if present in token)
[13] Check replay cache (jti must be unseen); check revocation list
[14] Evaluate Pkl policy (first-match wins, default deny) → emit audit event
```

---

## Hard Constraints — Never Violate

- **Never log a raw Oath Token** — tokens are bearer credentials; log `jti` instead.
- **Never extend TTL beyond 300 s** — the issuer clamps it; attempting to issue longer tokens
  will result in the issuer silently clamping to 300 s.
- **Never bypass verification for dev convenience** — do not add `if (dev) skip()` branches.
- **Never use `Bearer` header** — use `Authorization: OathMesh <token>`. `Bearer` is accepted
  by the verifier for compatibility but is actively discouraged.
- **Never use `HS256` or `RS256`** — the verifier rejects both. Only `EdDSA` and `ES256` are
  on the allowlist.
- **Never read `process.env` directly** — always use `env` from `lib/env.ts`.
- **Never use `alg: none`** — rejected at Step 02 of the verification pipeline.

---

## Test Commands

```bash
npm run test          # Vitest unit tests (run once)
npm run test:watch    # Vitest in watch mode
npm run test:e2e      # Playwright E2E tests (requires dev server)
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
```

---

## Authoritative Backend Documentation

| Document | URL |
|----------|-----|
| Token Format | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/token-format.md> |
| Claim Reference | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/claim-reference.md> |
| Verification Rules | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/verification-rules.md> |
| Error Taxonomy | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/error-taxonomy.md> |
| Audit Events | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/audit-events.md> |
| Threat Model | <https://github.com/oathmesh/oathmesh/blob/main/docs/security/threat-model.md> |
| Replay Defense | <https://github.com/oathmesh/oathmesh/blob/main/docs/security/replay-defense.md> |
| Key Management | <https://github.com/oathmesh/oathmesh/blob/main/docs/security/key-management.md> |
| Protect Next.js API | <https://github.com/oathmesh/oathmesh/blob/main/docs/quickstarts/protect-nextjs-api.md> |
| Architecture | <https://github.com/oathmesh/oathmesh/blob/main/ARCHITECTURE.md> |
