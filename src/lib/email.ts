import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(resendApiKey);

const FROM = process.env.EMAIL_FROM ?? "DevStash <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Send the email-verification message containing the single-use link.
 * The raw token is embedded in the URL; the DB stores only its hash.
 */
export async function sendVerificationEmail(params: {
  to: string;
  name?: string | null;
  token: string;
}): Promise<void> {
  const { to, name, token } = params;
  const verifyUrl = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
  const greeting = name ? `Hi ${name},` : "Hi,";

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your DevStash email",
    text: [
      greeting,
      "",
      "Welcome to DevStash! Confirm your email address to activate your account:",
      verifyUrl,
      "",
      "This link expires in 24 hours and can only be used once.",
      "If you didn't create a DevStash account, you can safely ignore this email.",
    ].join("\n"),
    html: verificationEmailHtml({ greeting, verifyUrl }),
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

function verificationEmailHtml({
  greeting,
  verifyUrl,
}: {
  greeting: string;
  verifyUrl: string;
}): string {
  return `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0a0a0a;">
    <h1 style="font-size: 20px; margin: 0 0 16px;">Verify your email</h1>
    <p style="margin: 0 0 12px; line-height: 1.5;">${greeting}</p>
    <p style="margin: 0 0 24px; line-height: 1.5;">
      Welcome to DevStash! Confirm your email address to activate your account.
    </p>
    <a href="${verifyUrl}"
       style="display: inline-block; background: #0a0a0a; color: #fafafa; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
      Verify email
    </a>
    <p style="margin: 24px 0 0; font-size: 13px; color: #737373; line-height: 1.5;">
      This link expires in 24 hours and can only be used once.<br />
      If you didn't create a DevStash account, you can safely ignore this email.
    </p>
  </div>`;
}
