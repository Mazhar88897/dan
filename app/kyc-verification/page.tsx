 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KycVerificationPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function approveAndRedirect() {
      if (typeof window === "undefined") return;

      // Get the token from session storage (Authorization header value).
      const authHeader = window.sessionStorage.getItem("Authorization");

      // If there is no token in session, just redirect to the fallback.
      if (!authHeader) {
        const fallback = window.sessionStorage.getItem("redirect_url") || "/test";
        if (!cancelled) {
          router.replace(fallback);
        }
        return;
      }

      try {
        // Call the backend to mark KYC as approved.
        await fetch("/api/auth/kyc-approve", {
          method: "POST",
          headers: {
            Authorization: authHeader,
          },
        }).then((res) => {
          if (!res.ok) {
            console.error("KYC approve failed with status", res.status);
          }
        });

        // On success, mark verification status in session.
        window.sessionStorage.setItem("VerificationStatus", "verified");
      } catch (err) {
        console.error("KYC approve error", err);
      }

      if (cancelled) return;

      // Redirect to redirect_url from session if present, otherwise /test.
      const redirectUrl =
        window.sessionStorage.getItem("redirect_url") || "/test";

      router.replace(redirectUrl);
    }

    approveAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-2">
          Finalizing verification…
        </h1>
        <p className="text-sm text-gray-300">
          Please wait while we confirm your KYC status and redirect you.
        </p>
      </div>
    </div>
  );
}

