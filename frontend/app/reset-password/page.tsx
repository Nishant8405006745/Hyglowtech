import type { Metadata } from "next";
import Link from "next/link";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new Hyglow Lighting password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Set a new password</h1>
        <p className="text-sm text-slate-400">Use at least 8 characters. You can show or hide each field.</p>
      </div>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-amber-400 transition-colors hover:text-amber-300">
          Back to sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
