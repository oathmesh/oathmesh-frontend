// @file emails/welcome.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  email: string;
}

export default function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to the OathMesh community — zero-trust machine identity for everyone
      </Preview>
      <Body
        style={{
          backgroundColor: '#0a0a0a',
          fontFamily: 'Inter, -apple-system, sans-serif',
          margin: 0,
        }}
      >
        <Container style={{ maxWidth: '560px', margin: '40px auto', padding: '0 20px' }}>
          <Section
            style={{
              backgroundColor: '#111111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '40px',
            }}
          >
            <Heading
              style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}
            >
              Welcome to OathMesh 🔐
            </Heading>
            <Text
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              You&apos;re now subscribed to OathMesh release notifications. We&apos;ll only send you
              meaningful updates — new SDK releases, security advisories, and major milestones.
            </Text>
            <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />
            <Text
              style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '16px' }}
            >
              Here&apos;s where to start:
            </Text>
            <Section>
              <Button
                href="https://oathmesh.dev/docs/quickstart"
                style={{
                  backgroundColor: '#0066ff',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginBottom: '12px',
                }}
              >
                Read the Quick Start guide →
              </Button>
            </Section>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '16px' }}>
              <Link href="https://github.com/oathmesh/oathmesh" style={{ color: '#3385ff' }}>
                GitHub
              </Link>
              {' · '}
              <Link href="https://oathmesh.dev/wishlist" style={{ color: '#3385ff' }}>
                Wishlist
              </Link>
              {' · '}
              <Link href="https://oathmesh.dev/donate" style={{ color: '#3385ff' }}>
                Support the project
              </Link>
            </Text>
          </Section>
          <Text
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            Sent to {email} ·{' '}
            <Link
              href="https://oathmesh.dev/unsubscribe"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
