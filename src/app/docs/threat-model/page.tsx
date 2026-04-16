import { Callout } from '@/components/docs/callout';
import { GitHubEditLink } from '@/components/docs/github-edit-link';
// @file app/docs/threat-model/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Threat Model',
  description: 'OathMesh threat model — attack surfaces, mitigations, and key compromise response.',
};

export default function ThreatModelPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="threat-model.md" />
      <h1>Threat Model</h1>
      <p>
        This document describes the threat actors OathMesh is designed to defend against, what it
        explicitly does not protect against, and the procedures for recovering from a key
        compromise.
      </p>

      <h2>Threat actors</h2>
      <ul>
        <li>
          <strong>External attacker with network access</strong> — can intercept traffic on
          unencrypted links, capture tokens in transit
        </li>
        <li>
          <strong>Compromised service</strong> — an internal service that has been exploited and is
          under attacker control
        </li>
        <li>
          <strong>Malicious insider</strong> — an engineer with access to secrets, source code, or
          deployment pipelines
        </li>
        <li>
          <strong>Replay attacker</strong> — attempts to reuse a captured valid token after it was
          issued
        </li>
        <li>
          <strong>Privilege escalation attacker</strong> — attempts to use a token with more
          permissions than it was issued for
        </li>
      </ul>

      <h2>Attack surfaces and mitigations</h2>

      <h3>Token interception in transit</h3>
      <p>
        <strong>Attack:</strong> Attacker captures a token from an unencrypted HTTP connection.
      </p>
      <p>
        <strong>Mitigation:</strong> TTL ≤ 300 seconds limits the usability window. Always use TLS
        in production. The <code>rqh</code> claim optionally binds the token to a specific request
        body, preventing use against different endpoints even within the TTL window.
      </p>

      <h3>Replay attack</h3>
      <p>
        <strong>Attack:</strong> Attacker captures a valid token and resubmits it before expiry.
      </p>
      <p>
        <strong>Mitigation:</strong> The <code>jti</code> uniqueness invariant and replay cache
        prevent exact replay. A replayed token is rejected at step 12 of the verification pipeline
        and logged.
      </p>

      <h3>Token forgery</h3>
      <p>
        <strong>Attack:</strong> Attacker creates a token with arbitrary claims without the issuer's
        private key.
      </p>
      <p>
        <strong>Mitigation:</strong> Ed25519 signature verification at step 4. Without the 32-byte
        private key, signature forgery is computationally infeasible.
      </p>

      <h3>Compromised service lateral movement</h3>
      <p>
        <strong>Attack:</strong> A compromised service uses its own valid tokens to call services it
        was never supposed to access.
      </p>
      <p>
        <strong>Mitigation:</strong> The policy engine (step 14) enforces that a subject can only
        call audiences permitted by the active Pkl policy. A compromised <code>payments-svc</code>{' '}
        cannot mint a token for <code>user-db</code> if the policy does not allow it.
      </p>

      <h2>What OathMesh does NOT protect against</h2>
      <Callout type="warning" title="Design boundaries">
        Understanding what OathMesh does not protect against is as important as understanding what
        it does.
      </Callout>
      <ul>
        <li>
          <strong>Issuer compromise:</strong> If the issuer's private key is stolen, an attacker can
          mint arbitrary tokens. Protect the issuer's private key with the same rigor as a CA
          private key.
        </li>
        <li>
          <strong>Application-level vulnerabilities:</strong> OathMesh verifies the caller's
          identity, not the correctness of the application logic. SQL injection in the upstream
          service is not an OathMesh problem.
        </li>
        <li>
          <strong>Denial of service:</strong> OathMesh does not rate-limit callers. Add rate
          limiting at the API gateway or load balancer layer.
        </li>
        <li>
          <strong>Exfiltration of data in allowed responses:</strong> If <code>payments-svc</code>{' '}
          is permitted to call <code>read</code> on <code>billing-api</code>, OathMesh cannot
          prevent <code>payments-svc</code> from exfiltrating the response data if it is
          compromised.
        </li>
      </ul>

      <h2>Replay attack defense in depth</h2>
      <p>OathMesh's replay defense has three independent layers:</p>
      <ol>
        <li>
          <strong>TTL ≤ 300s</strong> — limits the attack window regardless of replay cache state
        </li>
        <li>
          <strong>jti uniqueness check</strong> — rejects exact replays within the TTL window
        </li>
        <li>
          <strong>Audit logging</strong> — enables detection of replay patterns (multiple deny
          events with the same jti)
        </li>
      </ol>

      <h2>Key compromise response procedure</h2>
      <ol>
        <li>
          Immediately generate a new Ed25519 key pair: <code>oathmesh keygen --out ./keys-new</code>
        </li>
        <li>Add the new public key to JWKS alongside the old key (dual-key period begins)</li>
        <li>Wait 5 minutes for JWKS cache to expire across all receivers</li>
        <li>Update the issuer to sign new tokens with the new private key</li>
        <li>Wait 300 seconds (maximum old token TTL) for all old-key tokens to expire</li>
        <li>Remove the compromised public key from JWKS</li>
        <li>Revoke the compromised private key in your secret manager</li>
        <li>
          Audit logs for the compromise window: correlate all allows from the compromise period and
          investigate each caller
        </li>
      </ol>
      <p>
        Total time from compromise detection to full containment: approximately 10 minutes if steps
        are executed immediately.
      </p>
    </article>
  );
}
