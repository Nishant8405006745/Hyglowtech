"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { formatApiErrorBody } from "@/lib/format-api-error";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(formatApiErrorBody(data));
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthCard>
        <h2 className="text-lg font-semibold text-white">Check your instructions</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          If an account exists for <span className="font-medium text-amber-100/90">{email}</span>, we’ve issued a reset.
          With email not configured, your API server logs the reset link at <strong>INFO</strong> — check the terminal where
          FastAPI is running.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
        >
          ← Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-5">
        <div className="space-y-1">
          <label htmlFor="fp-email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="fp-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-night-950/60 px-3 py-2.5 text-slate-100 shadow-inner outline-none transition-all duration-200 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-semibold text-night-950 shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out-expo hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthCard>
  );
}
