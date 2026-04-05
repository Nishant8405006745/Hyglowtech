import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-night-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="animate-fade-in lg:animate-none">
          <AuthBrandPanel />
        </div>
        <div className="flex flex-col justify-center bg-night-950 px-4 py-10 sm:px-8 lg:bg-night-900/40 lg:px-16 xl:px-24">
          <div className="animate-fade-up mx-auto w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
