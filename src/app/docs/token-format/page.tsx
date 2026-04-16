import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { GitHubEditLink } from '@/components/docs/github-edit-link';
// @file app/docs/token-format/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Token Format',
  description:
    'OathMesh JWT anatomy — header, payload, signature, all claims, and the om+jwt type extension.',
};

const claims = [
  {
    claim: 'alg',
    location: 'Header',
    type: 'string',
    desc: 'Always "EdDSA". Any other value is rejected.',
  },
  {
    claim: 'typ',
    location: 'Header',
    type: 'string',
    desc: '"om+jwt" — the OathMesh type extension. Receivers reject tokens with typ != "om+jwt".',
  },
  {
    claim: 'iss',
    location: 'Payload',
    type: 'string (URL)',
    desc: 'The issuer URL. Receivers compare this against their configured trusted issuer.',
  },
  {
    claim: 'sub',
    location: 'Payload',
    type: 'string',
    desc: 'The subject — the caller\'s identity (e.g., "payments-svc"). Non-empty, required.',
  },
  {
    claim: 'aud',
    location: 'Payload',
    type: 'string',
    desc: 'The intended audience — the receiving service identifier (e.g., "billing-api"). Non-empty, required.',
  },
  {
    claim: 'act',
    location: 'Payload',
    type: 'string[]',
    desc: 'Permitted actions (e.g., ["read", "list"]). The receiver checks the required action is present.',
  },
  {
    claim: 'jti',
    location: 'Payload',
    type: 'string',
    desc: 'JWT ID — a unique identifier for this token. Used for replay protection. Non-empty, required.',
  },
  {
    claim: 'iat',
    location: 'Payload',
    type: 'number (Unix)',
    desc: 'Issued-at timestamp. Used for TTL clamp check: exp − iat must be ≤ 300.',
  },
  {
    claim: 'exp',
    location: 'Payload',
    type: 'number (Unix)',
    desc: 'Expiration timestamp. Required. Receivers reject tokens where now() ≥ exp (with ±10s skew).',
  },
  {
    claim: 'rqh',
    location: 'Payload',
    type: 'string (opt)',
    desc: 'SHA-256 of the request hash — binds the token to a specific request body. Optional but recommended for state-changing actions.',
  },
];

export default function TokenFormatPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="token-format.md" />
      <h1>Token Format</h1>
      <p>
        OathMesh tokens are JSON Web Signatures (JWS) using Ed25519 (EdDSA) and a custom{' '}
        <code>om+jwt</code> type header. They are compact, URL-safe, and can be transmitted in any
        HTTP header.
      </p>

      <h2>Structure</h2>
      <p>An OathMesh token consists of three Base64url-encoded segments separated by dots:</p>
      <CodeBlock
        code={`<Base64url(header)>.<Base64url(payload)>.<Base64url(signature)>

# Example (abbreviated):
eyJhbGciOiJFZERTQSIsInR5cCI6Im9tK2p3dCJ9
.eyJpc3MiOiJodHRwczovL2lzc3Vlci5pbnRlcm5hbCIsInN1YiI6InBheW1lbnRzLXN2YyIsImF1ZCI6ImJpbGxpbmctYXBpIiwiYWN0IjpbInJlYWQiXSwianRpIjoiMDFIWFlaMFBZQlhFMTA1R1hFOE41NkQwWlkiLCJpYXQiOjE3MTYwMDAwMDAsImV4cCI6MTcxNjAwMDMwMH0
.abc123...signature`}
        language="text"
      />

      <h2>Header</h2>
      <CodeBlock
        code={`{
  "alg": "EdDSA",    // Ed25519 signature algorithm
  "typ": "om+jwt"    // OathMesh type extension — receivers reject anything else
}`}
        language="json"
      />

      <h2>Payload — example with annotations</h2>
      <CodeBlock
        code={`{
  "iss": "https://issuer.internal",  // Trusted issuer URL
  "sub": "payments-svc",             // Caller identity
  "aud": "billing-api",              // Target service
  "act": ["read", "list"],           // Permitted actions
  "jti": "01HXYZ0PYBXE105GXE8N56D0ZY",  // Unique token ID (ULID)
  "iat": 1716000000,                 // Issued at (Unix seconds)
  "exp": 1716000300                  // Expires at iat + 300s
}`}
        language="json"
      />

      <Callout type="info" title="The om+jwt type extension">
        The <code>om+jwt</code> media type is registered to signal that this token carries
        OathMesh-specific claims (<code>act</code>, <code>rqh</code>) and must pass the OathMesh
        verification pipeline. Standard JWT libraries will accept it as a valid JWT, but OathMesh
        SDK verifiers additionally check the <code>typ</code> value to prevent token substitution
        attacks where a generic JWT is presented to an OathMesh-protected endpoint.
      </Callout>

      <h2>All claims reference</h2>
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-surface-2">
              {['Claim', 'Location', 'Type', 'Description'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/35"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {claims.map((c) => (
              <tr key={c.claim}>
                <td className="px-4 py-3 font-mono text-xs text-brand-light">{c.claim}</td>
                <td className="px-4 py-3 text-white/45 text-xs">{c.location}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/40">{c.type}</td>
                <td className="px-4 py-3 text-xs text-white/60">{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Signature</h2>
      <p>
        The signature is produced by signing the ASCII representation of{' '}
        <code>Base64url(header).Base64url(payload)</code> with the issuer's Ed25519 private key.
        Receivers verify it against the public key fetched from the issuer's JWKS endpoint.
      </p>
      <p>
        Ed25519 was chosen over RS256 and HS256 for its small key size (32 bytes), fast verification
        (single-core throughput of millions of verifications per second), and resistance to timing
        attacks. It also has no configurable parameters — there is nothing to misconfigure.
      </p>
    </article>
  );
}
