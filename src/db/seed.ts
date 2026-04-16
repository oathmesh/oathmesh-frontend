// @file db/seed.ts
import { db } from './index';
import { donations, wishlistItems } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // ── Wishlist items ──────────────────────────────────────────────────────────
  const items = [
    {
      title: 'Rust SDK',
      description:
        'Native Rust SDK for OathMesh token minting and verification. Critical for high-performance microservices and WebAssembly targets. Should support async runtimes (tokio, async-std) and provide a tower middleware layer.',
      category: 'sdk',
      status: 'planned',
      votes: 84,
      authorName: 'Matías Fernández',
    },
    {
      title: 'Java / Spring Boot SDK',
      description:
        'First-class Spring Boot starter that integrates OathMesh as a Spring Security filter. Enterprise teams need this to adopt OathMesh without leaving the JVM ecosystem.',
      category: 'sdk',
      status: 'open',
      votes: 71,
      authorName: 'Priya Kapoor',
    },
    {
      title: 'mTLS Gateway Mode',
      description:
        'Extend the OathMesh gateway to support mutual TLS as an additional authentication layer alongside signed tokens. Useful for high-security on-prem deployments that already have PKI infrastructure.',
      category: 'feature',
      status: 'open',
      votes: 56,
      authorName: 'Lars Eriksson',
    },
    {
      title: 'Policy UI Editor',
      description:
        'A browser-based visual editor for OathMesh Pkl policy files. Real-time validation, diff view against current active policy, and one-click hot-reload trigger.',
      category: 'feature',
      status: 'in-progress',
      votes: 103,
      authorName: 'Amara Osei',
      githubIssueUrl: 'https://github.com/oathmesh/oathmesh/issues/42',
    },
    {
      title: 'Audit Dashboard (hosted)',
      description:
        'A lightweight hosted dashboard that ingests OathMesh NDJSON audit logs and provides real-time allow/deny charts, anomaly alerts, and caller attribution.',
      category: 'feature',
      status: 'open',
      votes: 91,
      authorName: 'Chen Wei',
    },
    {
      title: 'GitLab CI Issuer',
      description:
        'An OathMesh issuer that exchanges GitLab CI JWT tokens for OathMesh-signed tokens, enabling pipelines to call internal APIs without long-lived credentials.',
      category: 'integration',
      status: 'planned',
      votes: 48,
      authorName: 'Fatima Al-Amin',
      githubIssueUrl: 'https://github.com/oathmesh/oathmesh/issues/67',
    },
    {
      title: 'GitHub App Token Exchange',
      description:
        'Allow GitHub Actions workflows to exchange their OIDC tokens for OathMesh tokens via a GitHub App. Eliminates all static secrets from CI/CD pipelines.',
      category: 'integration',
      status: 'shipped',
      votes: 137,
      authorName: 'Tom Ramirez',
      githubIssueUrl: 'https://github.com/oathmesh/oathmesh/issues/23',
    },
    {
      title: 'Official Helm Chart',
      description:
        'Production-grade Helm chart for deploying the OathMesh issuer on Kubernetes. Should include HPA, PodDisruptionBudget, RBAC, and optional Prometheus ServiceMonitor.',
      category: 'integration',
      status: 'in-progress',
      votes: 79,
      authorName: 'Kira Nakamura',
      githubIssueUrl: 'https://github.com/oathmesh/oathmesh/issues/88',
    },
    {
      title: 'Terraform Provider',
      description:
        'A terraform-provider-oathmesh that lets teams manage OathMesh issuers, policies, and key rotation as infrastructure-as-code. Publish to the Terraform Registry.',
      category: 'integration',
      status: 'open',
      votes: 62,
      authorName: 'Daniel Okafor',
    },
    {
      title: 'VSCode Extension',
      description:
        'A VSCode extension that validates OathMesh Pkl policy files inline, provides auto-complete for all OathMesh-specific Pkl classes, and shows live policy evaluation results against example tokens.',
      category: 'docs',
      status: 'open',
      votes: 44,
      authorName: 'Sophie Müller',
    },
  ];

  await db.insert(wishlistItems).values(
    items.map((item) => ({
      ...item,
      updatedAt: new Date(),
    })),
  );

  console.log(`✓ Inserted ${items.length} wishlist items`);

  // ── Donations ───────────────────────────────────────────────────────────────
  const donationData = [
    {
      stripeSessionId: 'cs_test_seed_001',
      stripePaymentIntentId: 'pi_test_seed_001',
      amountCents: 500,
      donorName: 'Anonymous',
      showOnWall: false,
      status: 'completed' as const,
      completedAt: new Date('2024-12-01'),
    },
    {
      stripeSessionId: 'cs_test_seed_002',
      stripePaymentIntentId: 'pi_test_seed_002',
      amountCents: 2000,
      donorName: 'Priya K.',
      message: 'Love the zero-trust approach. Keep it up!',
      showOnWall: true,
      status: 'completed' as const,
      completedAt: new Date('2025-01-15'),
    },
    {
      stripeSessionId: 'cs_test_seed_003',
      stripePaymentIntentId: 'pi_test_seed_003',
      amountCents: 10000,
      donorName: 'Lars Eriksson',
      message: 'Replacing our IAM nightmare with OathMesh. Happy to support.',
      showOnWall: true,
      status: 'completed' as const,
      completedAt: new Date('2025-02-03'),
    },
    {
      stripeSessionId: 'cs_test_seed_004',
      stripePaymentIntentId: 'pi_test_seed_004',
      amountCents: 50000,
      donorName: 'InfraEdge Systems',
      message: 'Great project. The gateway mode saved us weeks of custom auth work.',
      showOnWall: true,
      status: 'completed' as const,
      completedAt: new Date('2025-02-28'),
    },
    {
      stripeSessionId: 'cs_test_seed_005',
      stripePaymentIntentId: 'pi_test_seed_005',
      amountCents: 2500,
      donorName: 'Tom R.',
      message: '',
      showOnWall: true,
      status: 'completed' as const,
      completedAt: new Date('2025-03-12'),
    },
  ];

  await db.insert(donations).values(donationData);
  console.log(`✓ Inserted ${donationData.length} donations`);

  console.log('✅ Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
