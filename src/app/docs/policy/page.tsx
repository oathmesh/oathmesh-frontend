import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { GitHubEditLink } from '@/components/docs/github-edit-link';
// @file app/docs/policy/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Policy Engine',
  description:
    'OathMesh uses Apple Pkl for hot-reload policy. Learn default-deny semantics, common patterns, and how hot-reload works.',
};

export default function PolicyPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="policy.md" />
      <h1>Policy Engine</h1>
      <p>
        OathMesh uses{' '}
        <a href="https://pkl-lang.org" target="_blank" rel="noopener noreferrer">
          Apple Pkl
        </a>{' '}
        as its policy language. Pkl is a type-safe configuration language that compiles to
        JSON/YAML. OathMesh evaluates Pkl policies at verification time and hot-reloads them without
        restarting the issuer or receivers.
      </p>

      <h2>Why Pkl?</h2>
      <p>
        Unlike OPA Rego or CEL, Pkl policies are statically typed and readable by engineers who have
        never used a policy language before. A Pkl policy reads like configuration, not code. The
        type system catches errors at write time, and the hot-reload path makes zero-downtime policy
        updates practical.
      </p>

      <h2>Default-deny semantics</h2>
      <p>
        OathMesh policies are default-deny. If no rule explicitly allows a (sub, aud, act)
        combination, the request is denied. This means the safe failure mode is always denial, not
        permission. You write allow rules; everything else is denied automatically.
      </p>

      <Callout type="warning" title="Empty policy = total deny">
        If the policy file is empty or fails to parse, OathMesh falls back to denying all tokens. It
        does not fall back to allowing all — that would defeat the purpose of having a policy.
      </Callout>

      <h2>Example policy file</h2>
      <CodeBlock
        code={`// policy.pkl — OathMesh policy file
import "package://pkg.pkl-lang.org/oathmesh/oathmesh@1.0.0#/Policy.pkl"

rules: List<Policy.Rule> = new {
  // payments-svc may read and list billing-api
  new Policy.Allow {
    subjectPrefix = "payments-svc"
    audience = "billing-api"
    actions = List("read", "list")
  }

  // deploy-bot may create and delete in all infra-* audiences
  new Policy.Allow {
    subjectPrefix = "deploy-bot"
    audiencePattern = Regex("infra-.*")
    actions = List("create", "delete", "update")
  }

  // No service may call legacy-api during business hours
  new Policy.TimeDeny {
    audience = "legacy-api"
    days = List("Monday", "Tuesday", "Wednesday", "Thursday", "Friday")
    startHour = 9
    endHour = 18
    timezone = "America/New_York"
    reason = "Legacy API under maintenance window 09:00–18:00 ET"
  }

  // Explicitly deny audit-reader from any write action everywhere
  new Policy.Deny {
    subjectPrefix = "audit-reader"
    actions = List("create", "update", "delete")
    reason = "audit-reader is read-only by policy"
  }
}`}
        language="pkl"
        filename="policy.pkl"
      />

      <h2>Hot-reload</h2>
      <p>
        The issuer watches the policy file for changes using filesystem events (inotify on Linux,
        FSEvents on macOS). When a change is detected:
      </p>
      <ol>
        <li>The new policy is compiled and type-checked in a sandbox</li>
        <li>
          If compilation fails, the existing policy remains active and an error is logged — the
          issuer never switches to an invalid policy
        </li>
        <li>
          If compilation succeeds, the new policy atomically replaces the old one — the swap is done
          under a read-write lock so in-flight verifications complete under the old policy
        </li>
      </ol>
      <p>
        To trigger a manual reload without a file change (e.g., after a ConfigMap update in
        Kubernetes):
      </p>
      <CodeBlock
        code={`# Send SIGHUP to the issuer process
kill -HUP $(pidof oathmesh-issuer)

# Or via the management API
curl -X POST http://localhost:4001/admin/reload-policy`}
        language="bash"
      />

      <h2>Common patterns</h2>

      <h3>Allow by subject prefix</h3>
      <p>
        Use <code>subjectPrefix</code> to allow all services in a team to access a shared API:
      </p>
      <CodeBlock
        code={`new Policy.Allow {
  subjectPrefix = "data-team-"   // matches data-team-pipeline, data-team-jobs, etc.
  audience = "warehouse-api"
  actions = List("read", "query")
}`}
        language="pkl"
      />

      <h3>Deny a specific action everywhere</h3>
      <CodeBlock
        code={`new Policy.Deny {
  actions = List("admin")
  reason = "admin action globally disabled in production"
}`}
        language="pkl"
      />

      <h3>Time-based allow</h3>
      <CodeBlock
        code={`new Policy.TimeAllow {
  subjectPrefix = "batch-job"
  audience = "reporting-api"
  actions = List("export")
  startHour = 2
  endHour = 5
  timezone = "UTC"
  reason = "Batch export only permitted 02:00–05:00 UTC"
}`}
        language="pkl"
      />
    </article>
  );
}
