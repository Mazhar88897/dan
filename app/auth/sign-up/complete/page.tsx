"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "../../components/AuthShell";
import { getAuthApiBase, SIGNUP_EMAIL_KEY, SIGNUP_TOKEN_KEY } from "../../lib/api-base";
import { parseCountriesPayload } from "../../lib/parse-api";

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

function calculateAgeFromDob(dateOfBirth: string): number | null {
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
  }
  if (years < 0) return null;
  return years;
}

function CompleteSignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initDone, setInitDone] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/events");
  const dobInputRef = useRef<HTMLInputElement | null>(null);

  const openDobPicker = () => {
    const el = dobInputRef.current;
    if (!el) return;
    const pickerEl = el as HTMLInputElement & { showPicker?: () => void };
    // showPicker is supported by Chromium-based browsers.
    if (typeof pickerEl.showPicker === "function") {
      pickerEl.showPicker();
      return;
    }
    pickerEl.focus();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.sessionStorage.getItem(SIGNUP_TOKEN_KEY);
    const em = window.sessionStorage.getItem(SIGNUP_EMAIL_KEY);
    if (!t) {
      router.replace("/auth/sign-up");
      return;
    }
    setSignupToken(t);
    if (em) setEmail(em);
    const rQuery = searchParams.get("redirect")?.trim();
    const rSession = window.sessionStorage.getItem("auth_signup_redirect");
    if (rQuery) setRedirectTo(rQuery);
    else if (rSession) setRedirectTo(rSession);
    setInitDone(true);
  }, [router, searchParams]);

  useEffect(() => {
    if (!initDone) return;
    const base = getAuthApiBase();
    void (async () => {
      try {
        const res = await fetch(`${base}/api/countries`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          setCountriesError(`Could not load countries (${res.status}). Enter a valid country ID.`);
          setCountries([]);
          return;
        }
        const json: unknown = await res.json();
        setCountries(parseCountriesPayload(json));
        setCountriesError(null);
      } catch {
        setCountriesError("Network error loading countries.");
        setCountries([]);
      }
    })();
  }, [initDone]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!signupToken) {
      setError("Session expired. Start sign-up again.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!fullName.trim() || !dob || !countryId.trim()) {
      setError("Please fill in full name, date of birth, and country.");
      return;
    }
    const computedAge = calculateAgeFromDob(dob);
    if (computedAge === null) {
      setError("Please enter a valid date of birth.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const url = `${getAuthApiBase()}/api/auth/signup`;
      const body: Record<string, string | number> = {
        signupToken,
        password,
        full_name: fullName.trim(),
        date_of_birth: dob,
        country_id: countryId.trim(),
        age: computedAge,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(friendlyApiError(data, `Sign up failed (${res.status})`));
      }

      const d =
        data && typeof data === "object" && "data" in data
          ? (data as { data: unknown }).data
          : data;
      const userObj = d && typeof d === "object" && d !== null ? (d as Record<string, unknown>) : null;
      const token =
        userObj && "token" in userObj && typeof userObj.token === "string" ? userObj.token : null;
      const user =
        userObj && "user" in userObj && userObj.user && typeof userObj.user === "object"
          ? (userObj.user as Record<string, unknown>)
          : null;
      const userId = user && "id" in user && typeof user.id === "string" ? user.id : null;
      const verificationStatus =
        user && "verification_status" in user && typeof user.verification_status === "string"
          ? user.verification_status
          : null;
      const cId =
        user && "country_id" in user && typeof user.country_id === "string" ? user.country_id : null;

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(SIGNUP_TOKEN_KEY);
        window.sessionStorage.removeItem("auth_signup_redirect");
        if (token && userId) {
          window.sessionStorage.setItem("Authorization", `Bearer ${token}`);
          window.sessionStorage.setItem("UserId", userId);
          if (cId) window.sessionStorage.setItem("CountryId", cId);
          if (verificationStatus) {
            window.sessionStorage.setItem("VerificationStatus", verificationStatus);
          }
        }
      }
      if (token && userId) {
        router.push(redirectTo || "/create-event");
      } else {
        router.push(
          `/auth/sign-in?registered=1&redirect=${encodeURIComponent(redirectTo || "/events")}`,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  if (!initDone || !signupToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] px-4 text-white">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <AuthShell
      currentStep={3}
      title="Your details"
      subtitle={
        email
          ? `Finishing account for ${email}. Password must be at least 6 characters.`
          : "Choose a password and confirm your details."
      }
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="su-name">
            Full name
          </label>
          <input
            id="su-name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="su-dob">
            Date of birth
          </label>
          <div className="relative">
            <input
              ref={dobInputRef}
              id="su-dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 pr-12 text-sm text-white [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={openDobPicker}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Open date picker"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="su-country">
            Country
          </label>
          {countries.length > 0 ? (
            <select
              id="su-country"
              required
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="su-country"
              type="text"
              required
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Country id from your server"
            />
          )}
          {countriesError && (
            <p className="text-[10px] text-amber-400/90">{countriesError}</p>
          )}
        </div>
        {dob ? (
          <p className="text-xs text-gray-400">
            Calculated age:{" "}
            <span className="font-medium text-gray-200">
              {calculateAgeFromDob(dob) ?? "-"}
            </span>
          </p>
        ) : null}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300" htmlFor="su-password">
            Password
          </label>
          <input
            id="su-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="At least 6 characters"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-center text-[11px] text-gray-500">
        <Link
          className="text-purple-300 underline"
          href={
            email
              ? `/auth/sign-up/verify-otp?${new URLSearchParams({
                  email,
                  ...(redirectTo && redirectTo !== "/events" ? { redirect: redirectTo } : {}),
                })}`
              : "/auth/sign-up/verify-otp"
          }
        >
          Back to code entry
        </Link>
      </p>
    </AuthShell>
  );
}

export default function CompleteSignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#050515] via-[#2a2a2a] to-[#050515] px-4 text-white">
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      }
    >
      <CompleteSignUpContent />
    </Suspense>
  );
}
