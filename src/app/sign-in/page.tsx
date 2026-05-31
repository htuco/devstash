import Link from "next/link";
import { Suspense } from "react";
import { Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./sign-in-form";

export const metadata = { title: "Sign in — DevStash" };

export default function SignInPage() {
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
          <CardHeader className="space-y-1.5 text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your DevStash account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-72" />}>
              <SignInForm />
            </Suspense>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
