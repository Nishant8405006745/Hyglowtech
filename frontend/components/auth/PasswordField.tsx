"use client";

import { useId, useState } from "react";

type Props = {
  label: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  id?: string;
};

export function PasswordField({
  label,
  autoComplete = "current-password",
  value,
  onChange,
  required = true,
  minLength,
  id: idProp,
}: Props) {
  const genId = useId();
  const id = idProp ?? genId;
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-night-950/60 py-2.5 pl-3 pr-12 text-slate-100 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-amber-200"
          aria-pressed={show}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
