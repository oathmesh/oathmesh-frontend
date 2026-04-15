// @file app/docs/audit/page.tsx
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { GitHubEditLink } from '@/components/docs/github-edit-link';

export const metadata: Metadata = {
  title: 'Audit Logs',
  description:
    'OathMesh NDJSON audit log format, field spec, and how to ship logs to Datadog, Grafana Loki, and CloudWatch.',
};

const fields = [
  { field: 'ts', type: 'string (RFC 3339)', desc: 'Event timestamp with millisecond precision.' },
  { field: 'jti', type: 'string', desc: 'Token ID from the jti claim. Unique per token.' },
  { field: 'sub', type: 'string', desc: 'Token subject (caller identity).' },
  { field: 'aud', type: 'string', desc: 'Token audience (target service).' },
  { field: 'act', type: 'string[]', desc: 'Actions from the token act claim.' },
  { field: 'required_action', type: 'string', desc: 'The specific action required by the endpoint.' },
  { field: 'result', type: '"allow" | "deny"', desc: 'Verification outcome.' },
  { field: 'reason', type: 'string', desc: 'Human-readable denial reason. Empty on allow.' },
  { field: 'step', type: 'number (1–14)', desc: 'The verification step that failed. 0 on allow.' },
  { field: 'latency_ms', type: 'number', desc: 'Time in milliseconds from token receipt to decision.' },
  { field: 'receiver', type: 'string', desc: 'The audience identifier of the verifying service.' },
];

export default function AuditPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="audit.md" />
      <h1>Audit Logs</h1>
      <p>
        OathMesh writes a structured NDJSON log line for every token verification
        attempt — both allowed and denied. The logs contain enough information to
        reconstruct every machine-to-machine call in your infrastructure.
      </p>

      <h2>Log format</h2>
      <p>
        Each line is a valid JSON object. Lines are separated by newlines (NDJSON
        / JSON Lines format). This makes them compatible with all major log
        aggregators without additional parsing.
      </p>

      <h3>Allow event</h3>
      <CodeBlock
        code={`{"ts":"2025-06-01T10:34:22.841Z","jti":"01HXYZ0PYBXE105GXE8N56D0ZY","sub":"payments-svc","aud":"billing-api","act":["read","list"],"required_action":"read","result":"allow","reason":"","step":0,"latency_ms":0.8,"receiver":"billing-api"}`}
        language="json"
        filename="oathmesh-audit.ndjson"
      />

      <h3>Deny event</h3>
      <CodeBlock
        code={`{"ts":"2025-06-01T10:34:23.012Z","jti":"01HXYZ0PYBXE105GXE8N56D0ZY","sub":"payments-svc","aud":"billing-api","act":["read"],"required_action":"delete","result":"deny","reason":"action 'delete' not in token act claim","step":13,"latency_ms":0.3,"receiver":"billing-api"}`}
        language="json"
        filename="oathmesh-audit.ndjson"
      />

      <Callout type="info" title="Replay deny events">
        When a token is rejected at step 12 (replay check), the <code>jti</code>{' '}
        of the replayed token is still logged. This lets you identify replay
        attacks by correlating multiple deny events with the same <code>jti</code>.
      </Callout>

      <h2>Field reference</h2>
      <div className="not-prose my-5 overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-surface-2">
              {['Field', 'Type', 'Description'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/35">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {fields.map((f) => (
              <tr key={f.field}>
                <td className="px-4 py-2.5 font-mono text-xs text-brand-light">{f.field}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-white/40">{f.type}</td>
                <td className="px-4 py-2.5 text-xs text-white/60">{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Shipping logs</h2>

      <h3>Datadog</h3>
      <CodeBlock
        code={`# docker-compose.yml
services:
  oathmesh-issuer:
    image: ghcr.io/oathmesh/issuer:latest
    labels:
      com.datadoghq.ad.logs: '[{"source": "oathmesh", "service": "issuer"}]'
    logging:
      driver: json-file`}
        language="yaml"
        filename="docker-compose.yml"
      />

      <h3>Grafana Loki (via Promtail)</h3>
      <CodeBlock
        code={`# promtail-config.yaml
scrape_configs:
  - job_name: oathmesh
    static_configs:
      - targets: [localhost]
        labels:
          job: oathmesh
          __path__: /var/log/oathmesh/*.ndjson
    pipeline_stages:
      - json:
          expressions:
            result: result
            sub: sub
            aud: aud
      - labels:
          result:
          sub:
          aud:`}
        language="yaml"
        filename="promtail-config.yaml"
      />

      <h3>AWS CloudWatch</h3>
      <CodeBlock
        code={`# Using the CloudWatch agent
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/oathmesh/audit.ndjson",
            "log_group_name": "/oathmesh/audit",
            "log_stream_name": "{instance_id}",
            "timestamp_format": "%Y-%m-%dT%H:%M:%S.%fZ"
          }
        ]
      }
    }
  }
}`}
        language="json"
        filename="cloudwatch-agent.json"
      />
    </article>
  );
}
