import type { Metadata } from "next";
import Link from "next/link";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password | Hyglow",
  description: "Choose a new Hyglow password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Set a new password</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Use at least 8 characters. You can show or hide each field.</p>
      </div>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
      <p className="mt-8 text-center text-sm text-zinc-500">
        <Link href="/login" className="font-semibold text-violet-600 transition-colors hover:text-violet-500 dark:text-violet-400">
          Back to sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
