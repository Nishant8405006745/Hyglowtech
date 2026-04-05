"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { formatApiErrorBody } from "@/lib/format-api-error";

function ResetInner() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Missing reset token in URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(formatApiErrorBody(data));
        return;
      }
      router.push("/login?reset=1");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthCard>
        <p className="text-sm text-slate-400">This page needs a valid reset link. Open the URL from your reset email or server log.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-medium text-amber-400 hover:text-amber-300">
          Request a new link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-5">
        <PasswordField
          id="reset-pw1"
          label="New password"
          value={password}
          onChange={setPassword}
          minLength={8}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm password"
          id="reset-pw2"
          value={password2}
          onChange={setPassword2}
          minLength={8}
          autoComplete="new-password"
        />
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-semibold text-night-950 shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out-expo hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<AuthCard>Loading…</AuthCard>}>
      <ResetInner />
    </Suspense>
  );
}
