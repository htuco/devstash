import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createEmailVerificationToken } from "@/lib/email-verification";
import { sendVerificationEmail } from "@/lib/email";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email").max(254),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, password: hashed },
    select: { id: true, email: true, name: true },
  });

  // Send the verification email. A delivery failure shouldn't roll back the
  // account — the user can request a new link from the sign-in flow.
  let emailSent = true;
  try {
    const token = await createEmailVerificationToken(user.id);
    await sendVerificationEmail({ to: user.email, name: user.name, token });
  } catch (err) {
    emailSent = false;
    console.error("Failed to send verification email:", err);
  }

  return NextResponse.json({ success: true, user, emailSent }, { status: 201 });
}
