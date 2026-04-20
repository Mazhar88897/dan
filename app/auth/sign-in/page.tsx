"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/events";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setError(null);
      setLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const url = `${baseUrl || "http://localhost:3000"}/api/auth/login`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: email, password }),
      });

      if (!res.ok) {
        throw new Error(`Login failed: ${res.status}`);
       
      }
     
      
   
      const body = await res.json();
      const token = body?.data?.token as string | undefined;
      const userId = body?.data?.user?.id as string | undefined;
      const verificationStatus = body?.data?.user?.verification_status as string | undefined;
      const countryId = body?.data?.user?.country_id as string | undefined;

      if (!token || !userId) {
        throw new Error("Invalid login response");
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("Authorization", `Bearer ${token}`);
        window.sessionStorage.setItem("UserId", userId);
        if (countryId) {
          window.sessionStorage.setItem("CountryId", countryId);
        }
        if (verificationStatus) {
          window.sessionStorage.setItem("VerificationStatus", verificationStatus);
        }
      }
      router.push("/create-event");
    //   if (verificationStatus === "unverified") {
    //     router.push("/kyc");
    //   } else {
    //     router.push(redirectTo);
    //   }
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] text-white flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-pink-500/60 blur-3xl opacity-40" />
        <div className="relative rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl p-8">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sign in to continue
          </h1>
          <p className="text-sm text-gray-300 mb-6">
            Enter your credentials to vote on events and track your participation.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1"> 
              <label className="text-xs font-medium text-gray-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-sm font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-gray-500 text-center">
            New here? Account creation is handled in the main app. Use the same email and
            password here.
          </p>
        </div>
      </div>
    </div>
  );
}

