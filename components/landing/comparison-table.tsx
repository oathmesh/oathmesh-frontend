// @file components/landing/comparison-table.tsx
import { Check, X, Minus } from 'lucide-react';

const rows = [
  {
    feature: 'Token lifetime',
    apiKey: 'Infinite (manual rotation)',
    jwt: 'Configurable (often hours–days)',
    oathmesh: '≤ 300 seconds (enforced)',
  },
  {
    feature: 'Cryptography',
    apiKey: 'None (bearer secret)',
    jwt: 'HS256 or RS256',
    oathmesh: 'Ed25519 exclusively',
  },
  {
    feature: 'Replay protection',
    apiKey: false,
    jwt: false,
    oathmesh: true,
  },
  {
    feature: 'Policy engine',
    apiKey: false,
    jwt: false,
    oathmesh: true,
  },
  {
    feature: 'Audit logging',
    apiKey: 'varies',
    jwt: 'varies',
    oathmesh: 'Built-in NDJSON (every request)',
  },
  {
    feature: 'Scoped actions',
    apiKey: false,
    jwt: 'Custom claim only',
    oathmesh: true,
  },
  {
    feature: 'Revocation',
    apiKey: 'Manual (slow)',
    jwt: 'Blocklist (extra infra)',
    oathmesh: 'Expiry by design',
  },
  {
    feature: 'Gateway mode',
    apiKey: false,
    jwt: false,
    oathmesh: true,
  },
  {
    feature: 'SDKs',
    apiKey: 'N/A (HTTP header)',
    jwt: 'Many (varies by impl)',
    oathmesh: 'Go, Node.js, Python',
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-emerald-400" aria-label="Yes" />;
  if (value === false) return <X className="mx-auto h-4 w-4 text-red-400/70" aria-label="No" />;
  return <span className="text-white/60 text-sm">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="bg-surface-0 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">
            How OathMesh compares
          </h2>
          <p className="text-white/50">
            Static keys and vanilla JWTs leave you one incident away from an
            expensive breach.
          </p>
        </div>

        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" role="table">
              <thead>
                <tr>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/35 bg-surface-2">
                    Feature
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/35 bg-surface-2 text-center">
                    API Keys
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/35 bg-surface-2 text-center">
                    Traditional JWT
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-brand bg-brand/8 text-center border-x border-brand/20">
                    OathMesh ✓
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row) => (
                  <tr key={row.feature} className="transition-colors hover:bg-white/2">
                    <td className="px-5 py-3.5 font-medium text-white/80">
                      {row.feature}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Cell value={row.apiKey} />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Cell value={row.jwt} />
                    </td>
                    <td className="bg-brand/5 border-x border-brand/15 px-5 py-3.5 text-center">
                      <Cell value={row.oathmesh} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
