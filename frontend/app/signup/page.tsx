import type { Metadata } from "next";
import Link from "next/link";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up | Hyglow",
  description: "Create a Hyglow account — you will be assigned the User role by default.",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Create your account</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          New signups get the <strong className="font-medium text-zinc-800 dark:text-zinc-200">User</strong> role. Ask an
          admin to promote you when needed.
        </p>
      </div>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-8 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-violet-600 transition-colors hover:text-violet-500 dark:text-violet-400"
        >
          Sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
