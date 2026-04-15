// @file app/docs/sdks/go/page.tsx
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { GitHubEditLink } from '@/components/docs/github-edit-link';

export const metadata: Metadata = { title: 'Go SDK', description: 'OathMesh Go SDK — chi middleware, context extraction, full example.' };

export default function GoSdkPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="sdks/go.md" />
      <h1>Go SDK</h1>
      <p>The OathMesh Go SDK provides a chi middleware and a low-level verifier for direct integration.</p>

      <h2>Installation</h2>
      <CodeBlock code={`go get github.com/oathmesh/oathmesh-go`} language="bash" />

      <h2>chi middleware</h2>
      <CodeBlock code={`package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	oathmesh "github.com/oathmesh/oathmesh-go"
	oathmeshchi "github.com/oathmesh/oathmesh-go/chi"
)

func main() {
	client, err := oathmesh.NewClient(oathmesh.Config{
		IssuerURL: "https://issuer.internal",
		Audience:  "billing-api",
	})
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()

	// Apply OathMesh middleware to all routes
	r.Use(oathmeshchi.Middleware(client))

	// Route requiring "read" action
	r.Get("/invoices", func(w http.ResponseWriter, r *http.Request) {
		caller := oathmeshchi.CallerFromContext(r.Context())
		// caller is guaranteed non-nil here — middleware rejected the request if token was invalid

		json.NewEncoder(w).Encode(map[string]any{
			"caller":  caller.Subject,
			"actions": caller.Actions,
			"tokenID": caller.TokenID,
		})
	})

	http.ListenAndServe(":8080", r)
}`} language="go" filename="main.go" />

      <h2>Extracting caller from context</h2>
      <CodeBlock code={`caller := oathmeshchi.CallerFromContext(ctx)
if caller == nil {
    // Should never happen if middleware is applied, but be defensive
    http.Error(w, "unauthorized", http.StatusUnauthorized)
    return
}

fmt.Printf("caller: %s, actions: %v, token: %s\\n",
    caller.Subject, caller.Actions, caller.TokenID)`} language="go" />

      <Callout type="info" title="Scoped action check">
        The middleware verifies the token is structurally valid and belongs to
        the configured audience. To additionally require a specific action on a
        per-route basis, use <code>oathmeshchi.RequireAction("delete")</code> as
        a second middleware on the route.
      </Callout>

      <h2>Minting tokens (caller side)</h2>
      <CodeBlock code={`issuer := oathmesh.NewIssuerClient("https://issuer.internal")

token, err := issuer.Mint(ctx, oathmesh.MintParams{
    Subject:  "payments-svc",
    Audience: "billing-api",
    Actions:  []string{"read", "list"},
})
if err != nil {
    return fmt.Errorf("mint: %w", err)
}

// Use token in outgoing request
req.Header.Set("Authorization", "Bearer "+token)`} language="go" />
    </article>
  );
}
