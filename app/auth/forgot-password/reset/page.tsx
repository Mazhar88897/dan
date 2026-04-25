"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

function ForgotResetPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = window.sessionStorage.getItem(RESET_TOKEN_KEY);
    const em = window.sessionStorage.getItem(RESET_EMAIL_KEY);
    if (!token) {
      router.replace("/auth/forgot-password");
      return;
    }
    setResetToken(token);
    if (em) setEmail(em);
    setReady(true);
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resetToken) {
      setError("Session expired. Start forgot-password again.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const url = `${getAuthApiBase()}/api/auth/reset-password`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: API expects raw resetToken in body (no Bearer prefix).
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(friendlyApiError(data, `Reset failed (${res.status})`));
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(RESET_TOKEN_KEY);
        window.sessionStorage.removeItem(RESET_EMAIL_KEY);
      }
      router.push("/auth/sign-in?passwordReset=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  if (!ready || !resetToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] px-4 text-white">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <AuthShell
      currentStep={3}
      title="Set new password"
      subtitle={
        email
          ? `Resetting password for ${email}.`
          : "Enter your new password."
      }
      footer={
        <p className="mt-6 text-center text-[11px] text-gray-500">
          Need a new code?{" "}
          <Link
            className="font-medium text-purple-300 underline decoration-purple-500/50 hover:text-purple-200"
            href="/auth/forgot-password"
          >
            Start again
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="fp-new-password">
            New password
          </label>
          <input
            id="fp-new-password"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="At least 6 characters"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="fp-confirm-password">
            Confirm new password
          </label>
          <input
            id="fp-confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Re-enter password"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ForgotPasswordResetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] px-4 text-white">
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      }
    >
      <ForgotResetPasswordContent />
    </Suspense>
  );
}
