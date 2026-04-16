import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { GitHubEditLink } from '@/components/docs/github-edit-link';
// @file app/docs/gateway/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gateway Mode',
  description: 'Use OathMesh as a reverse proxy to protect existing services without SDK changes.',
};

export default function GatewayPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="gateway.md" />
      <h1>Gateway Mode</h1>
      <p>
        Gateway mode runs OathMesh as a reverse proxy in front of an existing HTTP service. It
        verifies incoming OathMesh tokens, strips the Authorization header, injects verified
        identity headers, and forwards the request. The upstream service receives the request only
        after verification passes — it never sees invalid tokens.
      </p>

      <Callout type="tip" title="No SDK required">
        Gateway mode lets you add OathMesh protection to any HTTP service without modifying its
        source code. The upstream service reads caller identity from injected headers instead of
        parsing a JWT.
      </Callout>

      <h2>Starting the gateway</h2>
      <CodeBlock
        code={`# Protect an existing service running on port 8080
oathmesh serve \\
  --gateway \\
  --upstream http://myservice:8080 \\
  --listen :4443 \\
  --audience billing-api \\
  --issuer https://issuer.internal`}
        language="bash"
      />

      <h2>Injected headers</h2>
      <p>
        When a token passes verification, the gateway strips the original Authorization header and
        injects these headers before forwarding:
      </p>
      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-surface-2">
              {['Header', 'Value', 'Description'].map((h) => (
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
            {[
              ['X-OathMesh-Subject', 'payments-svc', 'Verified caller identity (sub claim)'],
              ['X-OathMesh-Action', 'read', 'Matched action from act claim'],
              ['X-OathMesh-Token-ID', 'jti_01HXYZ...', 'Token jti — correlates with audit log'],
              ['X-OathMesh-Audience', 'billing-api', 'Verified audience claim'],
              ['X-OathMesh-Issuer', 'https://issuer.internal', 'Verified issuer URL'],
            ].map(([header, value, desc]) => (
              <tr key={header}>
                <td className="px-4 py-2.5 font-mono text-xs text-brand-light">{header}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-white/40">{value}</td>
                <td className="px-4 py-2.5 text-xs text-white/60">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="Trust only from the gateway">
        Your upstream service must only accept these headers from the gateway itself — not from
        external callers. Add a network policy or firewall rule so the upstream port is not publicly
        reachable. Alternatively, configure the gateway to add a shared secret header that the
        upstream validates.
      </Callout>

      <h2>Docker Compose example</h2>
      <CodeBlock
        code={`# docker-compose.yml
services:
  oathmesh-gateway:
    image: ghcr.io/oathmesh/issuer:latest
    command: >
      serve
      --gateway
      --upstream http://billing-api:8080
      --listen :4443
      --audience billing-api
      --issuer https://issuer.internal
    ports:
      - "4443:4443"
    environment:
      OATHMESH_JWKS_URL: https://issuer.internal/jwks.json
    depends_on:
      - billing-api

  billing-api:
    image: your-billing-service:latest
    # NOT exposed to the host — only reachable via the gateway
    expose:
      - "8080"`}
        language="yaml"
        filename="docker-compose.yml"
      />

      <h2>Reading injected headers in your upstream</h2>
      <CodeBlock
        code={`// Express upstream — no OathMesh SDK needed
app.get('/invoices', (req, res) => {
  const caller = req.headers['x-oathmesh-subject'];
  const action = req.headers['x-oathmesh-action'];
  const tokenId = req.headers['x-oathmesh-token-id'];

  // Caller is already verified by the gateway
  console.log(\`\${caller} performed \${action} (token: \${tokenId})\`);
  res.json({ invoices: [] });
});`}
        language="typescript"
      />
    </article>
  );
}
