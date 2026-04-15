// @file components/landing/sdk-showcase.tsx
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const sdks = [
  {
    label: 'Go',
    language: 'go',
    code: `package main

import (
    "net/http"
    "github.com/oathmesh/oathmesh-go"
    "github.com/oathmesh/oathmesh-go/chi"
)

func main() {
    client := oathmesh.NewClient(oathmesh.Config{
        IssuerURL: "https://issuer.internal",
    })

    r := chi.NewRouter()
    // Protect all routes under /api
    r.Use(oathmesh_chi.Middleware(client, oathmesh_chi.Options{
        Audience: "billing-api",
    }))

    r.Get("/invoices", func(w http.ResponseWriter, r *http.Request) {
        caller := oathmesh_chi.CallerFromContext(r.Context())
        // caller.Subject == "payments-svc"
        // caller.Actions == ["read"]
        w.Write([]byte("Hello, " + caller.Subject))
    })

    http.ListenAndServe(":8080", r)
}`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `// Express middleware (Node.js)
import express from 'express';
import { createOathMeshMiddleware } from 'oathmesh/express';

const app = express();

const oathmesh = createOathMeshMiddleware({
  issuerUrl: 'https://issuer.internal',
  audience: 'billing-api',
});

app.get('/invoices', oathmesh({ actions: ['read'] }), (req, res) => {
  const { subject, actions } = req.oathmesh;
  // subject === "payments-svc"
  res.json({ invoices: [] });
});

// Next.js App Router (Edge Runtime compatible)
import { withOathMesh } from 'oathmesh/next';

export const GET = withOathMesh(
  async (req, { caller }) => {
    return Response.json({ caller: caller.subject });
  },
  { audience: 'api', actions: ['read'] }
);`,
  },
  {
    label: 'Python',
    language: 'python',
    code: `# FastAPI
from fastapi import FastAPI, Depends
from oathmesh.fastapi import OathMesh, Caller

app = FastAPI()
oathmesh = OathMesh(issuer_url="https://issuer.internal")

@app.get("/invoices")
async def list_invoices(
    caller: Caller = Depends(
        oathmesh.require(audience="billing-api", action="read")
    )
):
    # caller.subject == "payments-svc"
    return {"invoices": [], "caller": caller.subject}


# Flask
from flask import Flask, g
from oathmesh.flask import oathmesh_required

app = Flask(__name__)

@app.get("/invoices")
@oathmesh_required(audience="billing-api", action="read")
def list_invoices():
    # g.oathmesh_caller available
    return {"caller": g.oathmesh_caller.subject}`,
  },
];

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/40 transition-all hover:bg-white/6 hover:text-white/80"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function SdkShowcase() {
  const [active, setActive] = useState(0);
  const current = sdks[active]!;

  return (
    <section className="bg-surface-1 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">
            SDKs for every stack
          </h2>
          <p className="text-white/50">
            Drop-in middleware for Go, TypeScript, and Python. Edge Runtime compatible.
          </p>
        </div>

        <div className="card-surface overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-white/8 px-4">
            <div className="flex">
              {sdks.map((sdk, i) => (
                <button
                  key={sdk.label}
                  id={`sdk-tab-${sdk.label.toLowerCase()}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    'border-b-2 px-5 py-3 text-sm font-medium transition-colors',
                    i === active
                      ? 'border-brand text-white'
                      : 'border-transparent text-white/40 hover:text-white/70',
                  )}
                  aria-selected={i === active}
                  role="tab"
                >
                  {sdk.label}
                </button>
              ))}
            </div>
            <CopyButton code={current.code} />
          </div>

          {/* Code */}
          <div className="bg-surface-0/50 p-6">
            <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-white/75">
              <code>{current.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
