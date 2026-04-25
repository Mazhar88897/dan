"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "../../components/AuthShell";
import { getAuthApiBase, RESET_EMAIL_KEY, RESET_TOKEN_KEY } from "../../lib/api-base";

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

function getResetToken(data: unknown): string | null {
  if (data && typeof data === "object" && "data" in data) {
    const d = (data as { data: unknown }).data;
    if (d && typeof d === "object" && d !== null && "resetToken" in d) {
      const t = (d as { resetToken: unknown }).resetToken;
      if (typeof t === "string" && t.trim()) return t.trim();
    }
  }
  if (data && typeof data === "object" && "resetToken" in (data as object)) {
    const t = (data as { resetToken: unknown }).resetToken;
    if (typeof t === "string" && t.trim()) return t.trim();
  }
  return null;
}

function ForgotVerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = (searchParams.get("email") ?? "").trim();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fromStorage =
      typeof window !== "undefined" ? window.sessionStorage.getItem(RESET_EMAIL_KEY) : null;
    if (emailParam) {
      setEmail(emailParam);
    } else if (fromStorage) {
      setEmail(fromStorage);
    } else {
      router.replace("/auth/forgot-password");
    }
  }, [emailParam, router]);

  const effectiveEmail = email || emailParam;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!effectiveEmail) return;
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const url = `${getAuthApiBase()}/api/auth/verify-otp`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: effectiveEmail, otp: code }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(friendlyApiError(data, `Verification failed (${res.status})`));
      }

      const resetToken = getResetToken(data);
      if (!resetToken) {
        throw new Error("No reset token returned. Check the API response.");
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(RESET_TOKEN_KEY, resetToken);
        window.sessionStorage.setItem(RESET_EMAIL_KEY, effectiveEmail);
      }
      router.push("/auth/forgot-password/reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      currentStep={2}
      title="Verify code"
      subtitle={`Enter the 6-digit code sent to ${effectiveEmail || "your email"}.`}
      footer={
        <p className="mt-6 text-center text-[11px] text-gray-500">
          Wrong email?{" "}
          <Link className="font-medium text-purple-300 underline decoration-purple-500/50 hover:text-purple-200" href="/auth/forgot-password">
            Go back
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="fp-otp">
            One-time code
          </label>
          <input
            id="fp-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-center font-mono text-lg tracking-[0.4em] text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="000000"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify and continue"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ForgotPasswordVerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] px-4 text-white">
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      }
    >
      <ForgotVerifyOtpContent />
    </Suspense>
  );
}
