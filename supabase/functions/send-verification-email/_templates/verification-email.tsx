import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface VerificationEmailProps {
  supabase_url: string;
  token_hash: string;
  email_action_type: string;
  redirect_to: string;
}

export const VerificationEmail = ({
  supabase_url,
  token_hash,
  email_action_type,
  redirect_to,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify Your Email</Heading>
        <Text style={text}>
          Thanks for signing up! Please verify your email address by clicking the button below:
        </Text>
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          target="_blank"
          style={button}
        >
          Verify Email Address
        </Link>
        <Text style={{ ...text, color: '#ababab', marginTop: '14px' }}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
        <Text style={footer}>
          Power Tools - Your Productivity Hub
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '24px 0',
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};
