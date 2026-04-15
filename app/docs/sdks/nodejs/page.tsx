// @file app/docs/sdks/nodejs/page.tsx
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { TabGroup } from '@/components/docs/tab-group';
import { GitHubEditLink } from '@/components/docs/github-edit-link';

export const metadata: Metadata = { title: 'Node.js SDK', description: 'OathMesh Node.js/TypeScript SDK — Express, Next.js App Router, Edge Runtime.' };

export default function NodejsSdkPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="sdks/nodejs.md" />
      <h1>Node.js / TypeScript SDK</h1>
      <p>The <code>oathmesh</code> npm package supports Express, Next.js App Router, Hono, and any Edge Runtime environment.</p>

      <h2>Installation</h2>
      <CodeBlock code={`npm install oathmesh`} language="bash" />

      <h2>Express middleware</h2>
      <CodeBlock code={`import express from 'express';
import { createOathMeshMiddleware } from 'oathmesh/express';

const app = express();

// Initialize once — caches JWKS for 5 minutes
const oathmesh = createOathMeshMiddleware({
  issuerUrl: 'https://issuer.internal',
  audience: 'billing-api',
});

// Require 'read' action on this route
app.get('/invoices', oathmesh({ actions: ['read'] }), (req, res) => {
  // req.oathmesh is populated after successful verification
  const { subject, actions, tokenId } = req.oathmesh;
  res.json({ subject, actions });
});

// TypeScript: extend the Request type
declare global {
  namespace Express {
    interface Request {
      oathmesh: { subject: string; actions: string[]; tokenId: string };
    }
  }
}

app.listen(8080);`} language="typescript" filename="server.ts" />

      <h2>Next.js App Router</h2>
      <CodeBlock code={`// app/api/invoices/route.ts
import { withOathMesh } from 'oathmesh/next';

export const GET = withOathMesh(
  async (request, { caller }) => {
    // caller: { subject, actions, tokenId }
    return Response.json({ invoices: [], caller: caller.subject });
  },
  {
    issuerUrl: 'https://issuer.internal',
    audience: 'billing-api',
    actions: ['read'],
  }
);`} language="typescript" filename="app/api/invoices/route.ts" />

      <Callout type="info" title="Edge Runtime compatibility">
        The Node.js SDK is fully compatible with the Next.js Edge Runtime and
        Cloudflare Workers. It uses the Web Crypto API for Ed25519 verification
        instead of Node.js <code>crypto</code>. No additional configuration is
        needed — the SDK detects the runtime automatically.
      </Callout>

      <h2>Minting tokens</h2>
      <CodeBlock code={`import { mintToken } from 'oathmesh';

const token = await mintToken({
  issuerUrl: 'https://issuer.internal',
  subject: 'payments-svc',
  audience: 'billing-api',
  actions: ['read', 'list'],
});

const res = await fetch('https://billing.internal/invoices', {
  headers: { Authorization: \`Bearer \${token}\` },
});`} language="typescript" />
    </article>
  );
}
