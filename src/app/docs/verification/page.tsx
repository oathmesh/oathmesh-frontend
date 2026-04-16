import { Callout } from '@/components/docs/callout';
import { GitHubEditLink } from '@/components/docs/github-edit-link';
import { CheckCircle2, XCircle } from 'lucide-react';
// @file app/docs/verification/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verification Pipeline',
  description: "Full walkthrough of OathMesh's 14-step fail-closed token verification pipeline.",
};

const steps = [
  {
    name: 'Authorization header present',
    checks: 'Request contains Authorization: Bearer <token>',
    failError: '401 Unauthorized — missing Authorization header',
  },
  {
    name: 'JWT structure valid',
    checks: 'Token has exactly 3 dot-separated Base64url segments',
    failError: '401 Unauthorized — malformed token',
  },
  {
    name: 'Header algorithm is EdDSA',
    checks: 'alg == "EdDSA" AND typ == "om+jwt"',
    failError: '401 Unauthorized — unsupported algorithm',
  },
  {
    name: 'Signature verification',
    checks: 'Ed25519 signature valid against JWKS public key',
    failError: '401 Unauthorized — invalid signature',
  },
  {
    name: 'Issuer check',
    checks: 'iss claim matches the configured trusted issuer URL',
    failError: '401 Unauthorized — untrusted issuer',
  },
  {
    name: 'Audience check',
    checks: "aud claim matches this service's configured audience identifier",
    failError: '401 Unauthorized — audience mismatch',
  },
  {
    name: 'Expiry check (exp)',
    checks: 'now() < exp (with ±10s clock skew allowance)',
    failError: '401 Unauthorized — token expired',
  },
  {
    name: 'Not-before check (nbf)',
    checks: 'If nbf present: now() ≥ nbf (with ±10s clock skew)',
    failError: '401 Unauthorized — token not yet valid',
  },
  {
    name: 'TTL clamp check',
    checks: 'exp − iat ≤ 300 seconds',
    failError: '401 Unauthorized — token TTL exceeds maximum',
  },
  {
    name: 'Subject non-empty',
    checks: 'sub claim is a non-empty string',
    failError: '401 Unauthorized — missing subject',
  },
  {
    name: 'jti present and non-empty',
    checks: 'jti claim is a non-empty string',
    failError: '401 Unauthorized — missing jti',
  },
  {
    name: 'Replay check',
    checks: 'jti not already in replay cache (Redis or in-memory)',
    failError: '401 Unauthorized — token replayed',
  },
  {
    name: 'Action check',
    checks: 'act claim contains the action required by this endpoint',
    failError: '403 Forbidden — action not permitted',
  },
  {
    name: 'Policy engine check',
    checks: 'Active Pkl policy allows (sub, aud, act) combination',
    failError: '403 Forbidden — policy denied',
  },
];

export default function VerificationPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="verification.md" />
      <h1>Verification Pipeline</h1>
      <p>
        Every OathMesh receiver runs an identical 14-step verification pipeline before passing the
        request to application logic. The pipeline is <strong>fail-closed</strong>: any step failure
        immediately returns an error response. There is no partial pass.
      </p>

      <Callout type="info" title="Clock skew">
        Steps 7 and 8 allow ±10 seconds of clock skew between the issuer and receiver clocks. This
        is intentionally conservative. If your infrastructure has larger clock skew, fix NTP rather
        than increasing this tolerance.
      </Callout>

      <h2>The 14 steps</h2>
      <div className="not-prose mt-6 space-y-3">
        {steps.map((step, i) => (
          <div key={step.name} className="card-surface overflow-hidden" data-search-content>
            <div className="flex items-start gap-4 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-0.5 font-semibold text-white text-sm">{step.name}</p>
                <p className="text-xs text-white/55 mb-2">{step.checks}</p>
                <div className="flex items-center gap-1.5 text-xs text-red-400/80">
                  <XCircle className="h-3.5 w-3.5 shrink-0" />
                  {step.failError}
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500/40 mt-0.5" />
            </div>
          </div>
        ))}
      </div>

      <h2>Clock skew allowance</h2>
      <p>
        OathMesh allows ±10 seconds of clock skew on expiry and not-before checks. The allowance
        exists to handle minor NTP drift between the issuer and receiver hosts. It does not
        materially extend the token lifetime — a 300-second token with 10 seconds of leniency is
        still a 310-second worst-case window, not infinite.
      </p>

      <h2>Replay cache implementation</h2>
      <p>
        The replay cache stores seen <code>jti</code> values until their corresponding token would
        have expired (<code>exp + 10s</code>). By default, OathMesh uses an in-memory cache (fast,
        no external dependency) that is not shared between instances. For multi-instance
        deployments, configure Redis as the replay cache backend:
      </p>
      <p>
        See the <a href="/docs/faq">FAQ</a> for a comparison of Redis vs in-memory replay caching
        trade-offs.
      </p>

      <h2>Audit log on completion</h2>
      <p>
        After all 14 steps pass (or fail), the verifier writes a single NDJSON audit line with the
        result, latency, and all relevant claims. See <a href="/docs/audit">Audit Logs</a> for the
        full field spec.
      </p>
    </article>
  );
}
