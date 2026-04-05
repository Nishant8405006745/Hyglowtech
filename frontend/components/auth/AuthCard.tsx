/** Elevated surface for forms with smooth hover transition. */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-night-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-400 ease-out-expo hover:border-amber-400/20 hover:shadow-amber-500/10 sm:p-8">
      {children}
    </div>
  );
}
