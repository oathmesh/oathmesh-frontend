// @file components/landing/sdk-showcase.tsx
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

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
      className="flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
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
    <section className="bg-transparent py-32 relative text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl text-white">
            Native SDKs for every stack
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 max-w-xl mx-auto">
            Drop-in middleware for Go, TypeScript, and Python. Seamlessly integrated and completely
            Edge Runtime compatible.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[20px] bg-[#050505] border border-white/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,1)]">
          {/* Subtle top border gradient */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-2 bg-[#080808]">
            <div className="flex gap-2 relative">
              {sdks.map((sdk, i) => (
                <button
                  key={sdk.label}
                  id={`sdk-tab-${sdk.label.toLowerCase()}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    'relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors z-10',
                    i === active ? 'text-white' : 'text-white/40 hover:text-white/70',
                  )}
                  aria-selected={i === active}
                  role="tab"
                >
                  {i === active && (
                    <motion.div
                      layoutId="sdk-active-tab"
                      className="absolute inset-0 rounded-md bg-white/[0.06] border border-white/[0.08]"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative">{sdk.label}</span>
                </button>
              ))}
            </div>
            <CopyButton code={current.code} />
          </div>

          {/* Code Body */}
          <div className="relative p-6 bg-[#020202] min-h-[400px]">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <pre className="overflow-x-auto font-mono text-[13px] leading-[1.7] text-white/70">
                <code>{current.code}</code>
              </pre>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
