import type { Metadata } from "next";
import Link from "next/link";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Hyglow Lighting account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Forgot password</h1>
        <p className="text-sm text-slate-400">
          Enter your email. If an account exists, we’ll prepare a reset link (check API logs until email is configured).
        </p>
      </div>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-amber-400 transition-colors hover:text-amber-300">
          ← Back to sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
