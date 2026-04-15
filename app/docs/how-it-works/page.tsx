// @file app/docs/how-it-works/page.tsx
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { GitHubEditLink } from '@/components/docs/github-edit-link';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'The Caller → Issuer → Token → Receiver flow, TTL clamping, jti uniqueness, and JWKS caching explained.',
};

const FLOW_DIAGRAM = `
  ┌────────────────────────────────────────────────────────┐
  │                    CALLER (payments-svc)               │
  │                                                        │
  │  1. POST /mint {sub, aud, act}                         │
  │  ─────────────────────────────────────────────────►    │
  │                                                        │
  │                        ISSUER                          │
  │  ◄─────────────────────────────────────────────────    │
  │  2. Returns signed om+jwt (TTL ≤ 300s)                 │
  │                                                        │
  │  3. Bearer <token> → protected endpoint                │
  │  ─────────────────────────────────────────────────►    │
  │                                                        │
  │                      RECEIVER (billing-api)            │
  │  4. Fetches JWKS from issuer (cached)                   │
  │  5. Runs 14-step verification pipeline                  │
  │  6. Writes audit log (allow or deny)                    │
  │  7. Passes caller context to handler                    │
  └────────────────────────────────────────────────────────┘
`;

export default function HowItWorksPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="how-it-works.md" />
      <h1>How It Works</h1>
      <p>
        OathMesh has four actors: the <strong>Caller</strong> (the service
        making a request), the <strong>Issuer</strong> (the OathMesh server
        that mints tokens), the <strong>Token</strong> (the signed credential),
        and the <strong>Receiver</strong> (the service verifying the token).
      </p>

      <h2>End-to-end flow</h2>
      <pre className="code-block overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/70 my-5">
        {FLOW_DIAGRAM}
      </pre>

      <h3>Step 1 — Caller requests a token from the Issuer</h3>
      <p>
        The caller identifies itself to the issuer. Authentication at this step
        uses one of: a bootstrap secret (for development), mutual TLS (for
        production), or an OIDC token from an external identity provider (for
        CI/CD). The caller specifies the <code>subject</code> (its own
        identity), the <code>audience</code> (the target service), and the{' '}
        <code>actions</code> it needs to perform.
      </p>

      <h3>Step 2 — Issuer mints a signed token</h3>
      <p>
        The issuer validates the caller's identity, evaluates the active Pkl
        policy to confirm the requested audience/actions are permitted, clamps
        the TTL to ≤ 300 seconds, generates a unique <code>jti</code>, and
        signs the token with the Ed25519 private key. The token is returned as
        a compact JWS string with the custom <code>om+jwt</code> type header.
      </p>

      <h3>Step 3 — Caller presents the token</h3>
      <p>
        The token is attached to the outgoing request as a Bearer token in the
        Authorization header. No persistent connection to the issuer is required
        after minting. The caller should mint a new token for each request batch
        (or reuse within the TTL window, implementing its own expiry buffer).
      </p>

      <h3>Steps 4–7 — Receiver verifies and routes</h3>
      <p>
        The receiver fetches the issuer's JWKS endpoint (cached with a 5-minute
        TTL by default) to retrieve the public key. It then runs the{' '}
        <a href="/docs/verification">14-step verification pipeline</a>. On
        success, the caller's identity is injected into the request context and
        the handler is invoked. On any failure, a 401 or 403 is returned and the
        event is written to the audit log.
      </p>

      <h2>TTL clamping</h2>
      <p>
        The issuer enforces a maximum token lifetime of 300 seconds (5 minutes).
        This is a hard limit — the active Pkl policy cannot increase it, only
        decrease it. The rationale is that short-lived tokens are the primary
        security primitive in OathMesh. Without a strict upper bound, operators
        would be tempted to issue longer tokens during incidents, reintroducing
        the risk that OathMesh is designed to eliminate.
      </p>

      <Callout type="tip" title="Token buffering">
        For latency-sensitive callers, mint the token slightly before expiry
        rather than per-request. Keep a local cache with a 10-second expiry
        buffer: reuse the token until 10 seconds before its exp, then mint a
        new one.
      </Callout>

      <h2>The jti uniqueness invariant</h2>
      <p>
        Every token contains a <code>jti</code> (JWT ID) that is unique across
        all tokens ever issued by an issuer. The receiver stores seen{' '}
        <code>jti</code> values in a replay cache keyed by the token's{' '}
        <code>exp</code> time. When a token's expiry passes, its{' '}
        <code>jti</code> is eligible for eviction from the cache.
      </p>
      <p>
        The invariant this provides: even if an attacker captures a valid token
        in transit, they can only replay it once — and only within the token's
        300-second window. After expiry, the jti is still in cache until the
        eviction TTL passes, so a late replay attempt is also rejected.
      </p>

      <h2>JWKS caching</h2>
      <p>
        Receivers cache the issuer's JWKS with a configurable TTL (default 5
        minutes). This means the issuer does not need to be reachable for every
        token verification, and key rotation is propagated within the cache TTL.
        Key rotation procedure:
      </p>
      <ol>
        <li>
          Add the new public key to JWKS (both old and new keys present
          simultaneously)
        </li>
        <li>Wait for cache TTL to expire across all receivers (5 minutes)</li>
        <li>
          Begin issuing tokens with the new private key (old tokens still
          verifiable)
        </li>
        <li>
          After old tokens expire (max 300s), remove old key from JWKS
        </li>
      </ol>
    </article>
  );
}
