// @file components/landing/testimonials.tsx
const testimonials = [
  {
    quote:
      'We had an API key incident last year that cost us a week of incident response. OathMesh\'s 300-second TTL means a leaked token is worthless by the time an attacker reads it.',
    name: 'Priya Kapoor',
    role: 'Staff Security Engineer',
    company: 'FinLayer',
  },
  {
    quote:
      'The gateway mode let us add OathMesh to three existing internal services in a day — zero SDK changes. The X-OathMesh-Subject header is now the authoritative caller identity across our entire mesh.',
    name: 'Lars Eriksson',
    role: 'Platform Lead',
    company: 'InfraEdge Systems',
  },
  {
    quote:
      'Apple Pkl for policy is a genuinely good call. We write type-safe policy files, push them to the issuer, and they hot-reload in seconds. No restart, no downtime.',
    name: 'Amara Osei',
    role: 'Backend Architect',
    company: 'CloudBridge',
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-1 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">
          What engineers say
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="card-surface flex flex-col justify-between p-6"
            >
              <blockquote className="mb-6 text-sm leading-relaxed text-white/60">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption>
                <div className="font-medium text-white">{t.name}</div>
                <div className="text-xs text-white/40">
                  {t.role} · {t.company}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
