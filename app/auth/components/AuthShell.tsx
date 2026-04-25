import type { ReactNode } from "react";
import Link from "next/link";

const steps = [
  { n: 1, label: "Email" },
  { n: 2, label: "Verify" },
  { n: 3, label: "Account" },
];

export function AuthShell({
  title,
  subtitle,
  currentStep,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  currentStep: 1 | 2 | 3;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] text-white flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-pink-500/60 blur-3xl opacity-40" />
        <div className="relative rounded-3xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl">
          <ol className="mb-6 flex items-center justify-center gap-2 text-xs text-gray-400 sm:gap-4">
            {steps.map((s) => {
              const active = s.n === currentStep;
              const done = s.n < currentStep;
              return (
                <li
                  key={s.n}
                  className="flex min-w-0 items-center gap-1.5 sm:gap-2"
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold " +
                      (done
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : active
                          ? "border-2 border-purple-400 text-white"
                          : "border border-white/20 text-gray-500")
                    }
                  >
                    {done ? "✓" : s.n}
                  </span>
                  <span className={active ? "font-medium text-gray-200" : "hidden sm:inline"}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>

          <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
            {title}
          </h1>
          <p className="mb-6 text-sm text-gray-300">{subtitle}</p>

          {children}

          {footer ?? (
            <p className="mt-6 text-center text-[11px] text-gray-500">
              Already have an account?{" "}
              <Link
                className="font-medium text-purple-300 underline decoration-purple-500/50 hover:text-purple-200"
                href="/auth/sign-in"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
