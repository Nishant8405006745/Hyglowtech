import Image from "next/image";
import Link from "next/link";

/** Left column: logo, gradient, and brand copy (used on login / signup / password flows). */
export function AuthBrandPanel() {
  return (
    <div className="relative flex min-h-[40vh] flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-fuchsia-950 px-8 py-10 text-white lg:min-h-screen lg:px-12 lg:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(244,114,182,0.25) 0%, transparent 40%)",
        }}
      />
      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-xl outline-none ring-white/40 transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/10 p-1 shadow-lg shadow-violet-950/50 ring-1 ring-white/20 backdrop-blur-sm transition-shadow duration-500 hover:shadow-xl">
            <Image
              src="/hyglow-logo.png"
              alt="Hyglow"
              width={160}
              height={160}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <span className="text-xl font-semibold tracking-tight">Hyglow</span>
        </Link>
      </div>

      <div className="relative z-10 mt-10 max-w-md space-y-4 lg:mt-0">
        <h2 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
          Operate your team with clarity.
        </h2>
        <p className="text-sm leading-relaxed text-violet-100/90 lg:text-base">
          Secure roles, people, and workflows — built for teams that outgrow spreadsheets.
        </p>
      </div>

      <p className="relative z-10 mt-8 text-xs text-violet-200/70 lg:mt-0">
        © {new Date().getFullYear()} Hyglow. Crafted for modern operations.
      </p>
    </div>
  );
}
