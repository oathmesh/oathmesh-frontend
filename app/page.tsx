// @file app/page.tsx
import type { Metadata } from 'next';
import { Hero } from '@/components/landing/hero';
import { ProblemStatement } from '@/components/landing/problem-statement';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { SdkShowcase } from '@/components/landing/sdk-showcase';
import { ComparisonTable } from '@/components/landing/comparison-table';
import { StatsBar } from '@/components/landing/stats-bar';
import { Testimonials } from '@/components/landing/testimonials';
import { CtaSection } from '@/components/landing/cta-section';
import { EmailSignup } from '@/components/landing/email-signup';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'OathMesh — Every machine call, a signed identity.',
  description:
    'Replace static API keys with Ed25519-signed, short-lived tokens. 14-step verification pipeline, replay protection, Apple Pkl policy engine. Open source, MIT.',
  openGraph: {
    title: 'OathMesh — Every machine call, a signed identity.',
    description:
      'Zero-trust machine identity. Ed25519 signatures. ≤300s TTL. Replay protection. Full audit trail.',
    url: 'https://oathmesh.dev',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ProblemStatement />
      <HowItWorks />
      <FeaturesGrid />
      <SdkShowcase />
      <ComparisonTable />
      <Testimonials />
      <CtaSection />
      <EmailSignup />
      <ToastProvider />
    </>
  );
}
