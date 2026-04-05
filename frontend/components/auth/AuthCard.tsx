/** Elevated surface for forms with subtle hover transition. */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-zinc-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-violet-200/30 dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-black/40 dark:hover:shadow-violet-950/20 sm:p-8">
      {children}
    </div>
  );
}
