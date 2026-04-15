// @file app/docs/faq/page.tsx
import type { Metadata } from 'next';
import { GitHubEditLink } from '@/components/docs/github-edit-link';
import { Callout } from '@/components/docs/callout';

export const metadata: Metadata = { title: 'FAQ', description: 'Frequently asked questions about OathMesh — key rotation, downtime, Redis vs in-memory, SPIFFE comparison, and more.' };

const faqs = [
  {
    q: 'How do I rotate the issuer\'s signing key?',
    a: 'Add the new public key to JWKS alongside the existing one (dual-key period). Wait 5 minutes for JWKS caches to refresh. Switch the issuer to sign with the new private key. Wait 300 seconds for old-key tokens to expire naturally. Remove the old public key from JWKS. See the Threat Model page for the full response procedure.',
  },
  {
    q: 'What happens if the issuer is down?',
    a: 'Receivers cache the JWKS for 5 minutes, so token verification continues to work for up to 5 minutes after issuer downtime. Callers that need to mint new tokens will fail during the downtime window. Design your system to treat the issuer as a high-availability component — run at least two replicas behind a load balancer.',
  },
  {
    q: 'Redis vs in-memory replay cache — which should I use?',
    a: 'Use in-memory for single-instance services or development. The in-memory cache is faster (no network round-trip) but is not shared between instances — a token verified by instance A can be replayed against instance B. Use Redis for any multi-instance deployment. The Redis replay cache adds ~1ms per verification but provides a global uniqueness guarantee across all verifier instances.',
  },
  {
    q: 'Can one issuer serve multiple tenants?',
    a: 'Yes. Use the subject prefix convention to namespace tenants: tenant-a/payments-svc vs tenant-b/payments-svc. Write Pkl policy rules scoped to each prefix. The audience claim is the second axis — tenant-a can be restricted to only call tenant-a/billing-api, never tenant-b/billing-api.',
  },
  {
    q: 'How does OathMesh compare to SPIFFE/SVID?',
    a: 'SPIFFE/SVID provides X.509 certificates for workload identity, typically with hour-long or day-long lifetimes managed via SPIRE. OathMesh focuses on request-scoped tokens with very short TTLs (≤300s), action claims, and a built-in policy engine. They are complementary: you can use SPIFFE for workload bootstrap authentication to the OathMesh issuer, then receive short-lived OathMesh tokens for each API call.',
  },
  {
    q: 'What is the maximum token size?',
    a: 'A standard OathMesh token with 3 actions is approximately 450–500 bytes as a compact JWS string. Custom claims (rqh, etc.) add payload. The Ed25519 signature is always 64 bytes. Tokens are designed to fit comfortably in HTTP headers (8KB header limit on most load balancers).',
  },
  {
    q: 'How does clock skew affect verification?',
    a: 'OathMesh allows ±10 seconds of clock skew on expiry and not-before checks. This is enough to handle minor NTP drift. For a 300-second token, this means verification accepts the token for up to 310 seconds after issuance in the worst case. Fix NTP rather than increasing the allowance.',
  },
  {
    q: 'Can I use OathMesh with GitHub Actions OIDC?',
    a: 'Yes — this is a common pattern. Configure the OathMesh issuer to accept GitHub Actions OIDC tokens as bootstrap credentials. The pipeline presents its OIDC token to the issuer, which validates it against the GitHub JWKS and issues an OathMesh token. The pipeline then uses the OathMesh token for all internal API calls. See the GitHub App Token Exchange wishlist item for the upcoming turnkey integration.',
  },
  {
    q: 'Pkl vs OPA — why does OathMesh use Pkl?',
    a: 'OPA Rego is powerful but has a steep learning curve and a non-obvious evaluation model. Pkl is statically typed and reads like configuration. OathMesh targets platform engineers who want to write policies, not policy engineers who write policy for a living. If you already have OPA/Rego in your stack, an OPA policy adapter is on the roadmap.',
  },
  {
    q: 'Does OathMesh support mutual TLS (mTLS)?',
    a: 'mTLS is supported as a bootstrap authentication method between the caller and the issuer. The caller presents a client certificate; the issuer validates it against a CA and issues an OathMesh token. mTLS between the caller and receiver is a separate concern — OathMesh does not manage TLS certificates for the receiver connection. See Gateway Mode for TLS termination at the proxy layer.',
  },
  {
    q: 'What happens if the Pkl policy has a syntax error?',
    a: 'The issuer validates and type-checks Pkl on load. If parsing fails, the existing valid policy remains active and an error is logged to stderr. The issuer NEVER falls back to allow-all — it keeps the last known good policy. Check issuer logs for the parse error and correct the policy file.',
  },
  {
    q: 'Can I use OathMesh for user-facing authentication?',
    a: 'OathMesh is designed for machine-to-machine authentication, not end-user authentication. It has no concept of login flows, sessions, or refresh tokens. For user authentication, use an OIDC provider (Auth0, Cognito, Okta) and configure OathMesh to accept those OIDC tokens as caller bootstrap credentials if needed.',
  },
];

export default function FaqPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="faq.md" />
      <h1>Frequently Asked Questions</h1>
      <p>
        Real questions from the OathMesh community. If your question isn&apos;t
        here, open a{' '}
        <a href="https://github.com/oathmesh/oathmesh/discussions" target="_blank" rel="noopener noreferrer">
          GitHub Discussion
        </a>
        .
      </p>

      <div className="not-prose mt-8 space-y-5">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="card-surface group open:border-white/14"
          >
            <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 font-medium text-white list-none marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="flex gap-3 text-sm">
                <span className="text-brand shrink-0 font-mono">Q{i + 1}</span>
                {faq.q}
              </span>
              <span className="mt-0.5 shrink-0 text-white/30 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-white/6 px-5 pb-5 pt-4 text-sm leading-relaxed text-white/60">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}
