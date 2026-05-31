import Link from "next/link";
import { Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "./register-form";

export const metadata = { title: "Create account — DevStash" };

export default function RegisterPage() {
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Start stashing your dev knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
