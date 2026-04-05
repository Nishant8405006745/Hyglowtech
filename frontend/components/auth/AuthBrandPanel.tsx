import Image from "next/image";
import Link from "next/link";

/** Left column: logo, warm light gradient, and lighting brand copy. */
export function AuthBrandPanel() {
  return (
    <div className="relative flex min-h-[42vh] flex-col justify-between overflow-hidden bg-gradient-to-br from-night-950 via-amber-950/40 to-night-900 px-8 py-10 text-white lg:min-h-screen lg:px-12 lg:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 25%, rgba(251, 191, 36, 0.35) 0%, transparent 42%), radial-gradient(circle at 85% 75%, rgba(56, 189, 248, 0.2) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.12) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-xl outline-none ring-amber-400/30 transition-transform duration-300 ease-out-expo hover:scale-[1.02] focus-visible:ring-2"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/10 p-1 shadow-lg shadow-amber-900/40 ring-1 ring-amber-400/30 backdrop-blur-sm transition-shadow duration-500 hover:shadow-xl hover:shadow-amber-500/20">
            <Image
              src="/hyglow-logo.png"
              alt="Hyglow Lighting"
              width={160}
              height={160}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Hy<span className="text-amber-300">glow</span>
          </span>
        </Link>
      </div>

      <div className="relative z-10 mt-10 max-w-md space-y-4 lg:mt-0">
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
          Sign in to your lighting workspace.
        </h2>
        <p className="text-sm leading-relaxed text-amber-100/85 lg:text-base">
          Manage trade orders, team access, and project history — built for electricians and buyers who live in lumens and cap
          types.
        </p>
      </div>

      <p className="relative z-10 mt-8 text-xs text-amber-200/60 lg:mt-0">
        © {new Date().getFullYear()} Hyglow Lighting. Electrical bulbs & lamps.
      </p>
    </div>
  );
}
