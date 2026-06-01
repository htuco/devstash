import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

// How long a verification link stays valid.
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Whether the email-verification system is active. Defaults to ON; set
 * `EMAIL_VERIFICATION_ENABLED=false` (or `0`) to disable it — useful while no
 * sending domain is verified in Resend, so registration isn't blocked.
 * When disabled, sign-ups are auto-verified, no email is sent, and the
 * sign-in block is skipped.
 */
export function isEmailVerificationEnabled(): boolean {
  const raw = process.env.EMAIL_VERIFICATION_ENABLED?.trim().toLowerCase();
  return raw !== "false" && raw !== "0";
}

/** SHA-256 hash of the raw token — only the hash is ever stored. */
function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Create a single-use email-verification token for a user.
 * Any existing tokens for that user are removed first (one live link at a time).
 * Returns the RAW token to embed in the email link (never persisted).
 */
export async function createEmailVerificationToken(
  userId: string,
): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const token = hashToken(rawToken);
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({ data: { token, userId, expires } }),
  ]);

  return rawToken;
}

type ConsumeResult =
  | { status: "verified"; email: string | null }
  | { status: "invalid" }
  | { status: "expired" };

/**
 * Validate a raw token and, if valid, mark the user's email as verified and
 * delete the token (single-use). Expired tokens are deleted and reported.
 */
export async function consumeEmailVerificationToken(
  rawToken: string,
): Promise<ConsumeResult> {
  const token = hashToken(rawToken);

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: { select: { id: true, email: true } } },
  });

  if (!record) return { status: "invalid" };

  if (record.expires < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    return { status: "expired" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);

  return { status: "verified", email: record.user.email };
}
