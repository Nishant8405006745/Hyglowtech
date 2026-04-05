"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { formatApiErrorBody } from "@/lib/format-api-error";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.get("registered") === "1" || search.get("reset") === "1") {
      setError(null);
    }
  }, [search]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(formatApiErrorBody(data));
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      {search.get("registered") === "1" ? (
        <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Account created. You can sign in now.
        </p>
      ) : null}
      {search.get("reset") === "1" ? (
        <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Password updated. Sign in with your new password.
        </p>
      ) : null}
      <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-5">
        <div className="space-y-1">
          <label htmlFor="login-email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-night-950/60 px-3 py-2.5 text-slate-100 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>
        <PasswordField label="Password" value={password} onChange={setPassword} autoComplete="current-password" />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-amber-400/90 transition-colors hover:text-amber-300"
          >
            Forgot password?
          </Link>
        </div>
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-semibold text-night-950 shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out-expo hover:scale-[1.01] hover:shadow-amber-400/35 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
}
