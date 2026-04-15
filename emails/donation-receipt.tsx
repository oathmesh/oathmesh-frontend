// @file emails/donation-receipt.tsx
import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

interface DonationReceiptEmailProps {
  donorName: string;
  amountFormatted: string;
  stripeSessionId: string;
  paymentIntentId: string;
  showOnWall: boolean;
}

export default function DonationReceiptEmail({
  donorName,
  amountFormatted,
  stripeSessionId,
  paymentIntentId,
  showOnWall,
}: DonationReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your {amountFormatted} donation to OathMesh — receipt inside</Preview>
      <Body style={{ backgroundColor: '#0a0a0a', fontFamily: 'Inter, -apple-system, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', padding: '0 20px' }}>
          <Section style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px' }}>
            <Heading style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
              Thank you, {donorName}! 🎉
            </Heading>
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Your donation of <strong style={{ color: '#3385ff' }}>{amountFormatted}</strong> has been received and will be used to fund OathMesh infrastructure, documentation, and SDK development.
            </Text>
            <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Amount:</strong> {amountFormatted}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Session ID:</strong>{' '}
              <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>{stripeSessionId}</code>
            </Text>
            {paymentIntentId && (
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Payment ID:</strong>{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>{paymentIntentId}</code>
              </Text>
            )}
            {showOnWall && (
              <Text style={{ color: 'rgba(16,185,129,0.8)', fontSize: '13px', marginBottom: '16px' }}>
                ✓ Your name will appear on the <Link href="https://oathmesh.dev/donate" style={{ color: '#3385ff' }}>donor wall</Link>.
              </Text>
            )}
            <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginTop: '24px', marginBottom: '16px' }} />
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
              This receipt is for your records. Payments are processed by Stripe.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
