"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function KycPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function startVerification() {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/kyc/start", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed: ${res.status}`);
      }
      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("No clientSecret returned");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Opens Stripe Identity document verification UI (modal)
      const result = await stripe.verifyIdentity(clientSecret);

      if (result?.error) {
        throw new Error(result.error.message ?? "Verification failed");
      }

      const session = result && "verificationSession" in result ? result.verificationSession : null;
      const status = session && "status" in session ? (session as { status: string }).status : undefined;

      const underReviewMessage =
        "We're reviewing your details. We'll update your account when verification is complete. You can close this page.";

      // "processing" OR modal closed with "Done" (Stripe often doesn't send status in client response)
      if (status === "processing" || (session && !result?.error && status === undefined)) {
        setSuccessMessage(underReviewMessage);
        return;
      }

      // "verified" = fully approved — call backend to mark user as KYC-approved
      if (status === "verified") {
        const authHeader =
          typeof window !== "undefined"
            ? window.sessionStorage.getItem("Authorization")
            : null;

        if (!authHeader) {
          throw new Error("Missing Authorization token in sessionStorage");
        }

        const approveRes = await fetch("/api/auth/kyc-approve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        });

        if (!approveRes.ok) {
          const data = await approveRes.json().catch(() => ({}));
          throw new Error(
            data.message ??
              data.error ??
              `KYC approve request failed: ${approveRes.status}`
          );
        }

        setSuccessMessage("KYC approved successfully.");
        return;
      }

      // requires_input, canceled, or unexpected
      if (status === "requires_input") {
        setError("Verification needs more information. Please try again.");
      } else if (status === "canceled") {
        setError("Verification was canceled.");
      } else {
        // status was undefined or something we don't handle (e.g. modal closed without finishing)
        setError(
          status
            ? `Verification ended with status: ${status}. Please try again.`
            : "Verification was not completed (e.g. the window was closed). Please try again and finish all steps."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Verify your identity
        </h1>
        <p className="text-slate-600 mb-6">
          Complete document verification with Stripe to continue.
        </p>
        <button
          type="button"
          onClick={startVerification}
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Opening…" : "Start verification"}
        </button>
        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-sm text-green-600" role="status">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
}
