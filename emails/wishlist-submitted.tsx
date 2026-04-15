// @file emails/wishlist-submitted.tsx
import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface WishlistSubmittedEmailProps {
  name?: string;
  title: string;
  description: string;
}

export default function WishlistSubmittedEmail({ name, title, description }: WishlistSubmittedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OathMesh feature request "{title}" was received</Preview>
      <Body style={{ backgroundColor: '#0a0a0a', fontFamily: 'Inter, -apple-system, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', padding: '0 20px' }}>
          <Section style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px' }}>
            <Heading style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
              Feature request received ✓
            </Heading>
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              Hi {name ?? 'there'}, thanks for submitting a feature request to OathMesh. The team will review it and may link it to a GitHub issue if planned.
            </Text>
            <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              {title}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              {description}
            </Text>
            <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              View the <Link href="https://oathmesh.dev/wishlist" style={{ color: '#3385ff' }}>wishlist</Link> to vote on other requests or track the status of yours.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
