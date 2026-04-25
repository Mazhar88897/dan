"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "../components/AuthShell";
import { getAuthApiBase, RESET_EMAIL_KEY } from "../lib/api-base";

function friendlyApiError(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  if (data && typeof data === "object" && "error" in data) {
    const e = (data as { error: unknown }).error;
    if (typeof e === "string" && e.trim()) return e;
  }
  return fallback;
}

function ForgotPasswordStep1Content() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setError(null);
    setLoading(true);
    try {
      const url = `${getAuthApiBase()}/api/auth/forgot-password`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(friendlyApiError(data, `Request failed (${res.status})`));
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(RESET_EMAIL_KEY, trimmed);
      }
      const q = new URLSearchParams();
      q.set("email", trimmed);
      router.push(`/auth/forgot-password/verify-otp?${q.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      currentStep={1}
      title="Forgot password"
      subtitle="Enter your email and we'll send a one-time code."
      footer={
        <p className="mt-6 text-center text-[11px] text-gray-500">
          Remembered it?{" "}
          <Link
            className="font-medium text-purple-300 underline decoration-purple-500/50 hover:text-purple-200"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="fp-email">
            Email
          </label>
          <input
            id="fp-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@example.com"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending code…" : "Continue"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] px-4 text-white">
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      }
    >
      <ForgotPasswordStep1Content />
    </Suspense>
  );
}
