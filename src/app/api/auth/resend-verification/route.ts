import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createEmailVerificationToken } from "@/lib/email-verification";
import { sendVerificationEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email("Invalid email").max(254),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, emailVerified: true, password: true },
  });

  // Only send for credentials accounts that exist and are still unverified.
  // Always respond 200 to avoid leaking which emails are registered.
  if (user && user.password && !user.emailVerified) {
    try {
      const token = await createEmailVerificationToken(user.id);
      await sendVerificationEmail({ to: user.email, name: user.name, token });
    } catch (err) {
      console.error("Failed to resend verification email:", err);
    }
  }

  return NextResponse.json(
    { message: "If that account exists and is unverified, a new link has been sent." },
    { status: 200 },
  );
}
