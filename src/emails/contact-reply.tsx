// @file emails/contact-reply.tsx
import {
  Body,
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

interface ContactReplyEmailProps {
  name: string;
  subject: string;
  message: string;
}

export default function ContactReplyEmail({ name, subject, message }: ContactReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We got your message — the OathMesh team will get back to you</Preview>
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
              style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}
            >
              We got your message, {name} 👋
            </Heading>
            <Text
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              Thanks for reaching out. The OathMesh team typically responds within 2–3 business
              days. Here&apos;s a copy of what you sent:
            </Text>
            <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />
            <Text
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              Subject: {subject}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '20px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message}
            </Text>
            <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '16px' }} />
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
              In the meantime, check out the{' '}
              <Link href="https://oathmesh.dev/docs/faq" style={{ color: '#3385ff' }}>
                FAQ
              </Link>{' '}
              or open a{' '}
              <Link
                href="https://github.com/oathmesh/oathmesh/discussions"
                style={{ color: '#3385ff' }}
              >
                GitHub Discussion
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
