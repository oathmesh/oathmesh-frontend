# OathMesh Frontend

> **Short-lived signed identity for every machine call.**
>
> Replace static API keys with cryptographically verified Oath Tokens that expire in ≤ 300 seconds.
> Every machine call gets a scoped, auditable identity. Zero leaked secrets.

[![Backend](https://img.shields.io/badge/backend-oathmesh%2Foathmesh-blue)](https://github.com/oathmesh/oathmesh)
[![Release](https://img.shields.io/badge/release-v1.0.5-green)](https://github.com/oathmesh/oathmesh/releases/tag/v1.0.5)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](./LICENSE)

---

## What Is This Repository?

`oathmesh-frontend` is the marketing and command-centre SaaS platform for the OathMesh identity
protocol. It provides:

- **Landing page** — developer-focused, dark-mode, explains the protocol
- **Feature wishlist** — community-driven roadmap with anonymous voting
- **Donation system** — Stripe-based contributions to fund development
- **Newsletter subscriptions** and **contact form**

The canonical protocol implementation (Go, v1.0.5) lives at
**<https://github.com/oathmesh/oathmesh>**. All token formats, claim names, TTL values, and
SDK signatures referenced here are sourced from that repository.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         OathMesh System                              │
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────────────────┐ │
│  │   Caller     │    │   Issuer     │    │   Receiver / Gateway   │ │
│  │ (agent://,   │───▶│ POST /v1/    │    │                        │ │
│  │  svc://, …)  │◀───│ token        │    │  14-step verifier      │ │
│  └──────────────┘    │ GET /.well-  │    │  Pkl policy engine     │ │
│         │            │ known/jwks   │    │  NDJSON audit          │ │
│         │            └──────────────┘    └────────────────────────┘ │
│         │                   │                        ▲              │
│         └───────────────────┼── Authorization: ──────┘              │
│                             │   OathMesh <token>                    │
│                             ▼                                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │          oathmesh-frontend  (this repo)                        │ │
│  │  Marketing · Wishlist · Donations · Newsletter                 │ │
│  │  Next.js 15 · Vercel · PostgreSQL · Stripe · Resend           │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Concern       | Technology                               | Version    |
|---------------|------------------------------------------|------------|
| Framework     | Next.js (App Router)                     | 15.1.5     |
| UI            | React                                    | 19.0.0     |
| Styling       | Tailwind CSS                             | v4         |
| Animation     | Framer Motion                            | ^11        |
| Database      | PostgreSQL + Drizzle ORM                 | ^0.38      |
| Cache / KV    | Upstash Redis / Vercel KV                | —          |
| Payments      | Stripe                                   | ^17        |
| Email         | Resend + React Email                     | ^4         |
| Unit tests    | Vitest                                   | ^3         |
| E2E tests     | Playwright                               | ^1.50      |
| Deployment    | Vercel                                   | —          |
| Language      | TypeScript                               | ^5         |

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- A **PostgreSQL** database (Vercel Postgres recommended)
- **Stripe** account (test keys sufficient for local dev)
- **Resend** account (free tier sufficient)
- **Upstash** Redis instance (optional; rate limiting falls back to in-memory)

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/oathmesh/oathmesh-frontend.git
cd oathmesh-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all required values (see **Environment Variables** below).

### 4. Initialise the database

```bash
npm run db:generate   # generate Drizzle migration files
npm run db:push       # apply schema to your PostgreSQL instance
```

To seed with sample data for local development:

```bash
npx tsx db/seed.ts
```

### 5. Start the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## OathMesh Integration

### Token Protocol Reference

Oath Tokens are compact JWS tokens. The format is three base64url segments separated by `.`:
`<header>.<payload>.<signature>`.

| Field           | Value                                                        |
|-----------------|--------------------------------------------------------------|
| `typ`           | `om+jwt`                                                     |
| `alg`           | `EdDSA` (primary); `ES256` accepted for compatibility         |
| `kid` format    | `issuer-key-YYYY-MM`                                         |
| Rejected algs   | `none`, `HS256`, `RS256` (keys < 2048 bits)                  |
| HTTP header     | `Authorization: OathMesh <token>`                            |
| Max TTL         | **300 seconds** — clamped by the issuer                      |
| Required claims | `iss`, `sub`, `aud`, `act`, `iat`, `exp`, `jti`              |
| `jti`           | UUID v4, globally unique — enables replay protection          |
| `rqh`           | Optional — SHA-256 of HTTP request fields (request binding)  |

### Protecting a Next.js App Router Route

Install the SDK:

```bash
npm install @oathmesh/oathmesh
```

Create a protected route:

```typescript
// app/api/agents/route.ts
import { withOathMesh } from '@oathmesh/oathmesh/next';
import { NextRequest, NextResponse } from 'next/server';

// Initialize once at module scope.
const oathmesh = withOathMesh({
  audience: process.env.OATHMESH_AUDIENCE!,          // must exactly match token's `aud` claim
  trustedIssuers: process.env.OATHMESH_TRUSTED_ISSUERS!.split(','),
});

export async function GET(request: NextRequest) {
  const { caller, error } = await oathmesh(request);
  if (error) return error; // structured 401 with OathMesh error taxonomy code

  return NextResponse.json({
    subject: caller.principal.subject,  // e.g. "agent://repo/acme/deploy-bot"
    action:  caller.action,             // value of the `act` claim
    tokenId: caller.tokenId,            // jti — log this, never the raw token
  });
}
```

Test with the OathMesh CLI:

```bash
# Mint a short-lived token (requires the backend binary — see backend repo)
TOKEN=$(./bin/oathmesh mint \
  --sub "agent://repo/acme/deploy-bot" \
  --aud "https://oathmesh.dev/api" \
  --act "read" --quiet)

curl -H "Authorization: OathMesh $TOKEN" http://localhost:3000/api/agents
```

### The 14-Step Verification Contract

Every Oath Token passes through a fail-closed pipeline. Any single failure returns
`401` with an error taxonomy code indicating the step number.

| Step | Check |
|------|-------|
| 01 | Parse structure — exactly 3 base64url segments |
| 02 | Validate header: `typ=om+jwt`, `alg` on allowlist, reject `alg=none` |
| 03 | Decode payload, extract `iss` |
| 04 | Check `iss` against trusted-issuers list |
| 05 | Load JWKS (cached, from `{iss}/.well-known/jwks`) |
| 06 | Verify JWS signature (Ed25519) + alg confusion check |
| 07 | Re-verify `iss` after signature check |
| 08 | Check `exp` (± 10 s clock skew) |
| 09 | Check `iat` / `nbf` (must not be in the future) |
| 10 | Check `aud` (exact string match) |
| 11 | Check all required claims present |
| 12 | Verify `rqh` binding (if present in token) |
| 13 | Check replay cache (`jti` must be unseen); check revocation list |
| 14 | Evaluate Pkl policy (first-match wins, default deny) → emit audit event |

**Fail-closed:** any failed step → `401`. The pipeline never silently skips a step.

---

## Environment Variable Reference

### Required

| Variable                 | Description                                            |
|--------------------------|--------------------------------------------------------|
| `POSTGRES_URL`           | Pooled PostgreSQL connection string                    |
| `STRIPE_SECRET_KEY`      | Stripe server-side key (`sk_test_…` / `sk_live_…`)    |
| `STRIPE_PUBLISHABLE_KEY` | Stripe client-side key (`pk_test_…` / `pk_live_…`)    |
| `STRIPE_WEBHOOK_SECRET`  | Stripe webhook signing secret (`whsec_…`)              |
| `RESEND_API_KEY`         | Resend transactional email key (`re_…`)                |

### Optional

| Variable                       | Default                              | Description                       |
|--------------------------------|--------------------------------------|-----------------------------------|
| `POSTGRES_URL_NON_POOLING`     | —                                    | Non-pooled URL for migrations      |
| `KV_REST_API_URL`              | —                                    | Upstash KV REST URL               |
| `KV_REST_API_TOKEN`            | —                                    | Upstash KV REST token             |
| `STRIPE_DONATION_PRICE_ID`     | —                                    | Fixed-amount donation tier         |
| `RESEND_FROM_EMAIL`            | `noreply@oathmesh.dev`               | Sender address                    |
| `RESEND_REPLY_TO`              | `team@oathmesh.dev`                  | Reply-to address                  |
| `NEXT_PUBLIC_APP_URL`          | `http://localhost:3000`              | Public app origin                 |
| `NEXT_PUBLIC_GITHUB_URL`       | `https://github.com/oathmesh/oathmesh` | Backend repo link               |
| `NEXT_PUBLIC_POSTHOG_KEY`      | —                                    | PostHog analytics                 |
| `NEXT_PUBLIC_POSTHOG_HOST`     | —                                    | PostHog host                      |

### OathMesh Token Verification (add when protecting routes)

| Variable                       | Description                                            |
|--------------------------------|--------------------------------------------------------|
| `OATHMESH_AUDIENCE`            | `aud` claim value this service expects                 |
| `OATHMESH_TRUSTED_ISSUERS`     | Comma-separated trusted issuer URLs                    |

All variables are validated at server startup via `lib/env.ts` (Zod schema). The server will
refuse to start if any required variable is missing or malformed.

---

## Testing

```bash
npm run test          # Vitest unit tests (run once, CI mode)
npm run test:watch    # Vitest in watch mode
npm run test:e2e      # Playwright E2E (start dev server first with npm run dev)
npm run typecheck     # TypeScript check (tsc --noEmit)
npm run lint          # ESLint
```

Playwright configuration is in `playwright.config.ts`. E2E tests live in `tests/`.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Read `AGENTS.md` for OathMesh-specific constraints before writing code.
3. Run `npm run typecheck && npm run test` before opening a PR.
4. All protocol facts (token format, claim names, TTL limits) must be sourced from the
   [backend repository](https://github.com/oathmesh/oathmesh). Do not invent claims or APIs.

---

## Backend Protocol Documentation

| Document | Link |
|----------|------|
| Architecture | <https://github.com/oathmesh/oathmesh/blob/main/ARCHITECTURE.md> |
| Token Format | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/token-format.md> |
| Claim Reference | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/claim-reference.md> |
| Verification Rules | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/verification-rules.md> |
| Error Taxonomy | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/error-taxonomy.md> |
| Audit Events | <https://github.com/oathmesh/oathmesh/blob/main/docs/protocol/audit-events.md> |
| Threat Model | <https://github.com/oathmesh/oathmesh/blob/main/docs/security/threat-model.md> |
| Replay Defense | <https://github.com/oathmesh/oathmesh/blob/main/docs/security/replay-defense.md> |
| Key Management | <https://github.com/oathmesh/oathmesh/blob/main/docs/security/key-management.md> |
| Protect Next.js API | <https://github.com/oathmesh/oathmesh/blob/main/docs/quickstarts/protect-nextjs-api.md> |

---

## License

MIT © OathMesh Contributors
