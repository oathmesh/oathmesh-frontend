import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { GitHubEditLink } from '@/components/docs/github-edit-link';
import { StepList } from '@/components/docs/step-list';
// @file app/docs/quickstart/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Start',
  description:
    'Install OathMesh, generate a key pair, mint your first token, and protect an endpoint — in under 10 minutes.',
};

export default function QuickstartPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="quickstart.md" />
      <h1>Quick Start</h1>
      <p>
        This guide takes you from zero to a working OathMesh setup in under 10 minutes. You will
        install the CLI, generate an Ed25519 key pair, start the issuer, mint a token, call a
        protected endpoint, and add the middleware to your own service.
      </p>

      <Callout type="info" title="Prerequisites">
        Docker ≥ 20.10, Node.js ≥ 18, and the OathMesh CLI. The CLI can be installed via npm,
        Homebrew, or downloading a binary from GitHub Releases.
      </Callout>

      <StepList
        steps={[
          {
            title: 'Install the CLI',
            children: (
              <>
                <p>Install the OathMesh CLI globally via npm:</p>
                <CodeBlock
                  code={`npm install -g oathmesh-cli
# Verify
oathmesh --version`}
                  language="bash"
                />
                <p>Or via Homebrew on macOS/Linux:</p>
                <CodeBlock
                  code={`brew tap oathmesh/tap
brew install oathmesh`}
                  language="bash"
                />
              </>
            ),
          },
          {
            title: 'Generate an Ed25519 key pair',
            children: (
              <>
                <p>
                  OathMesh uses Ed25519 exclusively. Generate a key pair and store it securely — the
                  private key is never transmitted.
                </p>
                <CodeBlock
                  code={`oathmesh keygen --out ./keys
# Output:
# ✓ Private key written to ./keys/oathmesh.key  (keep secret)
# ✓ Public key  written to ./keys/oathmesh.pub  (share with issuer)`}
                  language="bash"
                />
                <Callout type="warning" title="Protect your private key">
                  Never commit <code>oathmesh.key</code> to source control. Add <code>*.key</code>{' '}
                  to your <code>.gitignore</code>. In production, store it in a secret manager (AWS
                  Secrets Manager, GCP Secret Manager, HashiCorp Vault).
                </Callout>
              </>
            ),
          },
          {
            title: 'Start the issuer via Docker',
            children: (
              <>
                <p>
                  The OathMesh issuer is a small HTTP server that accepts mint requests, validates
                  identity, applies policy, and returns signed tokens.
                </p>
                <CodeBlock
                  code={`docker run -d \\
  --name oathmesh-issuer \\
  -p 4000:4000 \\
  -v $(pwd)/keys:/etc/oathmesh/keys:ro \\
  -v $(pwd)/policy.pkl:/etc/oathmesh/policy.pkl:ro \\
  -e OATHMESH_KEY_PATH=/etc/oathmesh/keys/oathmesh.key \\
  ghcr.io/oathmesh/issuer:latest`}
                  language="bash"
                />
                <p>
                  The issuer is now listening on <code>http://localhost:4000</code>. It serves a
                  JWKS endpoint at <code>/jwks.json</code> that receivers use to fetch the public
                  key.
                </p>
              </>
            ),
          },
          {
            title: 'Mint your first token',
            children: (
              <>
                <p>
                  Mint a token for the <code>payments-svc</code> service to call the{' '}
                  <code>billing-api</code>:
                </p>
                <CodeBlock
                  code={`oathmesh mint \\
  --issuer http://localhost:4000 \\
  --sub payments-svc \\
  --aud billing-api \\
  --act read,list

# Output:
# ✓ Token issued (TTL: 300s, jti: 01HXYZ...)
# eyJhbGciOiJFZERTQSIsInR5cCI6Im9tK2p3dCJ9...`}
                  language="bash"
                />
                <CodeBlock
                  code={`# Inspect the token
oathmesh inspect eyJhbGci...

# Output:
# {
#   "header": { "alg": "EdDSA", "typ": "om+jwt" },
#   "payload": {
#     "iss": "https://issuer.internal",
#     "sub": "payments-svc",
#     "aud": "billing-api",
#     "act": ["read", "list"],
#     "jti": "01HXYZ...",
#     "iat": 1716000000,
#     "exp": 1716000300
#   }
# }`}
                  language="bash"
                />
              </>
            ),
          },
          {
            title: 'Call a protected endpoint',
            children: (
              <>
                <p>Attach the token as a Bearer token in the Authorization header:</p>
                <CodeBlock
                  code={`TOKEN=$(oathmesh mint --issuer http://localhost:4000 \\
  --sub payments-svc --aud billing-api --act read)

curl -H "Authorization: Bearer $TOKEN" \\
  http://localhost:8080/invoices`}
                  language="bash"
                />
              </>
            ),
          },
          {
            title: 'Add OathMesh middleware to your service',
            children: (
              <>
                <p>
                  Install the SDK for your platform and add the middleware. Here is the Express
                  example — see the <a href="/docs/sdks">SDK reference</a> for Go and Python.
                </p>
                <CodeBlock code={`npm install oathmesh`} language="bash" />
                <CodeBlock
                  code={`import express from 'express';
import { createOathMeshMiddleware } from 'oathmesh/express';

const app = express();

// Initialize once; caches JWKS for 5 minutes
const oathmesh = createOathMeshMiddleware({
  issuerUrl: 'http://localhost:4000',
  audience: 'billing-api',
});

// Protect /invoices — only allow 'read' and 'list' actions
app.get('/invoices', oathmesh({ actions: ['read', 'list'] }), (req, res) => {
  const { subject, actions, tokenId } = req.oathmesh;
  res.json({ message: \`Hello \${subject}\`, actions });
});

app.listen(8080, () => console.log('listening on :8080'));`}
                  language="typescript"
                  filename="server.ts"
                />
                <Callout type="info" title="What the middleware does">
                  The middleware fetches the JWKS from the issuer (cached), verifies the Ed25519
                  signature, checks expiry + clock skew (±10s), validates the jti against a replay
                  cache, checks audience and actions against the active policy, and writes an audit
                  entry. Any failure returns 401.
                </Callout>
              </>
            ),
          },
        ]}
      />

      <h2>Next steps</h2>
      <ul>
        <li>
          <a href="/docs/token-format">Token format</a> — understand every claim in an OathMesh
          token
        </li>
        <li>
          <a href="/docs/verification">Verification pipeline</a> — the 14 steps your receiver runs
        </li>
        <li>
          <a href="/docs/policy">Policy engine</a> — write Pkl policies to control who can do what
        </li>
      </ul>
    </article>
  );
}
