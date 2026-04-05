import type { Metadata } from "next";
import Link from "next/link";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password | Hyglow",
  description: "Reset your Hyglow password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Forgot password</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter your email. If an account exists, we’ll prepare a reset link (check API logs until email is configured).
        </p>
      </div>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-8 text-center text-sm text-zinc-500">
        <Link href="/login" className="font-semibold text-violet-600 transition-colors hover:text-violet-500 dark:text-violet-400">
          ← Back to sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
