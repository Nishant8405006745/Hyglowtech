import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in | Hyglow",
  description: "Sign in to Hyglow — role-based dashboards for your team.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Sign in to continue to your Hyglow dashboard.</p>
      </div>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-8 text-center text-sm text-zinc-500">
        No account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-violet-600 transition-colors hover:text-violet-500 dark:text-violet-400"
        >
          Sign up
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
