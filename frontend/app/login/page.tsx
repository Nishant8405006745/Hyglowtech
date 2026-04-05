import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to Hyglow Lighting — trade accounts, orders, and team access.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="text-sm text-slate-400">Sign in to your Hyglow workspace — orders, team, and lighting catalogue.</p>
      </div>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-amber-400 transition-colors hover:text-amber-300">
          Sign up
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
