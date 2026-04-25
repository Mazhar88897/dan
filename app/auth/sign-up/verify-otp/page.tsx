"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "../../components/AuthShell";
import { getAuthApiBase, SIGNUP_EMAIL_KEY, SIGNUP_TOKEN_KEY } from "../../lib/api-base";

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

function getSignupToken(data: unknown): string | null {
  if (data && typeof data === "object" && "data" in data) {
    const d = (data as { data: unknown }).data;
    if (d && typeof d === "object" && d !== null && "signupToken" in d) {
      const t = (d as { signupToken: unknown }).signupToken;
      if (typeof t === "string" && t.trim()) return t.trim();
    }
  }
  if (data && typeof data === "object" && "signupToken" in (data as object)) {
    const t = (data as { signupToken: unknown }).signupToken;
    if (typeof t === "string" && t.trim()) return t.trim();
  }
  return null;
}

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = (searchParams.get("email") ?? "").trim();
  const redirect = searchParams.get("redirect")?.trim() || "/events";
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fromStorage =
      typeof window !== "undefined" ? window.sessionStorage.getItem(SIGNUP_EMAIL_KEY) : null;
    if (emailParam) {
      setEmail(emailParam);
    } else if (fromStorage) {
      setEmail(fromStorage);
    } else {
      router.replace("/auth/sign-up");
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
      const url = `${getAuthApiBase()}/api/auth/signup/verify-otp`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: effectiveEmail, otp: code }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(friendlyApiError(data, `Verification failed (${res.status})`));
      }
      const signupToken = getSignupToken(data);
      if (!signupToken) {
        throw new Error("No signup token returned. Check the API response.");
      }
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SIGNUP_TOKEN_KEY, signupToken);
        window.sessionStorage.setItem(SIGNUP_EMAIL_KEY, effectiveEmail);
        window.sessionStorage.setItem("auth_signup_redirect", redirect);
      }
      const q = new URLSearchParams();
      q.set("redirect", redirect);
      router.push(`/auth/sign-up/complete?${q.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      currentStep={2}
      title="Enter verification code"
      subtitle={`We sent a 6-digit code to ${effectiveEmail || "your email"}.`}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="su-otp">
            One-time code
          </label>
          <input
            id="su-otp"
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
      <p className="mt-4 text-center text-[11px] text-gray-500">
        Wrong email?{" "}
        <Link
          className="text-purple-300 underline"
          href={
            redirect && redirect !== "/events"
              ? `/auth/sign-up?redirect=${encodeURIComponent(redirect)}`
              : "/auth/sign-up"
          }
        >
          Go back
        </Link>
      </p>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] px-4 text-white">
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
