import Link from "next/link";
import { CheckCircle2, XCircle, Clock, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { consumeEmailVerificationToken } from "@/lib/email-verification";
import { ResendVerification } from "./resend-verification";

export const metadata = { title: "Verify email — DevStash" };

type Status = "verified" | "expired" | "invalid" | "missing";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let status: Status;
  if (!token) {
    status = "missing";
  } else {
    const result = await consumeEmailVerificationToken(token);
    status = result.status;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted/30 px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Database className="size-5 text-primary" />
          DevStash
        </Link>

        <Card>
          <CardHeader className="space-y-3 text-center">
            <StatusIcon status={status} />
            <CardTitle className="text-2xl">{titleFor(status)}</CardTitle>
            <CardDescription>{descriptionFor(status)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "verified" ? (
              <Link
                href="/sign-in?verified=1"
                className={buttonVariants({ className: "w-full" })}
              >
                Continue to sign in
              </Link>
            ) : (
              <ResendVerification />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "verified") {
    return (
      <CheckCircle2 className="mx-auto size-12 text-emerald-500" aria-hidden />
    );
  }
  if (status === "expired") {
    return <Clock className="mx-auto size-12 text-amber-500" aria-hidden />;
  }
  return <XCircle className="mx-auto size-12 text-destructive" aria-hidden />;
}

function titleFor(status: Status): string {
  switch (status) {
    case "verified":
      return "Email verified";
    case "expired":
      return "Link expired";
    case "missing":
      return "Missing token";
    default:
      return "Invalid link";
  }
}

function descriptionFor(status: Status): string {
  switch (status) {
    case "verified":
      return "Your email is confirmed. You can now sign in to DevStash.";
    case "expired":
      return "This verification link has expired. Enter your email to get a new one.";
    case "missing":
      return "No verification token was provided. Request a new link below.";
    default:
      return "This verification link is invalid or has already been used. Request a new one below.";
  }
}
