import type { Metadata } from "next";
import Link from "next/link";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Hyglow Lighting trade account — default User role; admins can promote for buying access.",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Create your account</h1>
        <p className="text-sm text-slate-400">
          New signups get the <strong className="font-medium text-slate-200">User</strong> role. Ask an admin to promote you
          for trade pricing or team tools when ready.
        </p>
      </div>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-amber-400 transition-colors hover:text-amber-300">
          Sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
