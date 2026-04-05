"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { formatApiErrorBody } from "@/lib/format-api-error";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(formatApiErrorBody(data));
        return;
      }
      router.push("/login?registered=1");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-5">
        <div className="space-y-1">
          <label htmlFor="su-name" className="text-sm font-medium text-slate-300">
            Name
          </label>
          <input
            id="su-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-night-950/60 px-3 py-2.5 text-slate-100 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="su-email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="su-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-night-950/60 px-3 py-2.5 text-slate-100 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-xs text-slate-500">At least 8 characters. You can show or hide it with the button on the field.</p>
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-semibold text-night-950 shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out-expo hover:scale-[1.01] hover:shadow-amber-400/35 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
