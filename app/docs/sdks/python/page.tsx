// @file app/docs/sdks/python/page.tsx
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/code-block';
import { GitHubEditLink } from '@/components/docs/github-edit-link';

export const metadata: Metadata = { title: 'Python SDK', description: 'OathMesh Python SDK — FastAPI, Flask, Django integration examples.' };

export default function PythonSdkPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="sdks/python.md" />
      <h1>Python SDK</h1>
      <p>The <code>oathmesh</code> PyPI package supports FastAPI, Flask, and Django out of the box.</p>

      <h2>Installation</h2>
      <CodeBlock code={`pip install oathmesh`} language="bash" />

      <h2>FastAPI</h2>
      <CodeBlock code={`from fastapi import FastAPI, Depends
from oathmesh.fastapi import OathMesh, Caller

app = FastAPI()

oathmesh = OathMesh(
    issuer_url="https://issuer.internal",
    audience="billing-api",
)

@app.get("/invoices")
async def list_invoices(
    caller: Caller = Depends(oathmesh.require(action="read"))
):
    # caller.subject == "payments-svc"
    # caller.actions == ["read", "list"]
    # caller.token_id == "jti_01HXYZ..."
    return {"invoices": [], "caller": caller.subject}


@app.get("/invoices/{id}")
async def get_invoice(
    id: str,
    caller: Caller = Depends(oathmesh.require(action="read")),
):
    return {"id": id, "caller": caller.subject}`} language="python" filename="main.py" />

      <h2>Flask</h2>
      <CodeBlock code={`from flask import Flask, g, jsonify
from oathmesh.flask import OathMesh

app = Flask(__name__)
oathmesh = OathMesh(issuer_url="https://issuer.internal", audience="billing-api")

@app.get("/invoices")
@oathmesh.require(action="read")
def list_invoices():
    caller = g.oathmesh_caller
    return jsonify({"invoices": [], "caller": caller.subject})`} language="python" filename="app.py" />

      <h2>Django middleware</h2>
      <CodeBlock code={`# settings.py
MIDDLEWARE = [
    "oathmesh.django.OathMeshMiddleware",
    # ... other middleware
]

OATHMESH = {
    "ISSUER_URL": "https://issuer.internal",
    "AUDIENCE": "billing-api",
    # Routes that don't require OathMesh verification
    "EXEMPT_PATHS": ["/health", "/metrics"],
}

# views.py
from oathmesh.django import require_action

@require_action("read")
def list_invoices(request):
    caller = request.oathmesh_caller
    return JsonResponse({"invoices": [], "caller": caller.subject})`} language="python" />

      <h2>Minting tokens</h2>
      <CodeBlock code={`from oathmesh import mint_token
import httpx

token = mint_token(
    issuer_url="https://issuer.internal",
    subject="payments-svc",
    audience="billing-api",
    actions=["read", "list"],
)

async with httpx.AsyncClient() as client:
    res = await client.get(
        "https://billing.internal/invoices",
        headers={"Authorization": f"Bearer {token}"},
    )`} language="python" />
    </article>
  );
}
