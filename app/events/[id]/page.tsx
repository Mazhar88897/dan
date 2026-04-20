"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

type Event = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  is_public: boolean;
  is_white_label: boolean;
  category_id: string | null;
  category_name?: string;
  start_date: string;
  end_date: string;
  created_at: string;
  status?: string;
};

type EventOption = {
  id: string;
  event_id: string;
  name: string;
  description: string;
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId =
    typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<EventOption | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const getRemainingMs = (e: Event | null, currentTimeMs: number) => {
    if (!e) return 0;
    const end = new Date(e.end_date).getTime();
    return Math.max(end - currentTimeMs, 0);
  };

  useEffect(() => {
    if (!eventId) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const url = `${baseUrl}/api/events/${eventId}`;

    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load event: ${res.status}`);
        return res.json();
      })
      .then((data: Event) => setEvent(data ?? null))
      .catch((err) => setError(err?.message ?? "Failed to load event"))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const url = `${baseUrl || "http://localhost:3000"}/api/event-options/by-event?event_id=${eventId}`;

    setOptionsLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load event options: ${res.status}`);
        return res.json();
      })
      .then((data: EventOption[]) => setEventOptions(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load event options:", err);
        setEventOptions([]);
      })
      .finally(() => setOptionsLoading(false));
  }, [eventId]);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const countdown = useMemo(() => {
    if (!event) return "";
    const diffMs = getRemainingMs(event, nowMs);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `Ends in ${String(days).padStart(2, "0")}:${String(hours).padStart(
      2,
      "0",
    )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [event, nowMs]);

  const checkAuthStatus = () => {
    if (typeof window === "undefined") return { hasToken: false, isVerified: false };
    const token = window.sessionStorage.getItem("Authorization");
    const verificationStatus = window.sessionStorage.getItem("VerificationStatus");
    return {
      hasToken: !!token,
      isVerified: verificationStatus === "verified",
    };
  };

  const handleOptionClick = (option: EventOption) => {
    setSelectedOption(option);
    const { hasToken, isVerified } = checkAuthStatus();

    if (!hasToken) {
      setShowLoginModal(true);
      return;
    }

    if (!isVerified) {
      setShowKycModal(true);
      return;
    }

    // Both token and KYC are present, show confirmation modal
    setShowConfirmModal(true);
  };

  const handleVoteSubmit = async () => {
    if (!selectedOption || !eventId) return;

    try {
      setVoteError(null);
      setVoteLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const url = `${baseUrl || "http://localhost:3000"}/api/votes`;
      const auth =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("Authorization")
          : null;
      const userId =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("UserId")
          : null;

      if (!auth) {
        throw new Error("Not authenticated");
      }

      if (!userId) {
        throw new Error("User ID missing from session");
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          user_id: userId,
          event_id: eventId,
          option_id: selectedOption.id,
          country_id: sessionStorage.getItem("CountryId"),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = String(errData.message ?? "");

        // If backend says user already voted, just send them to results
        if (message.toLowerCase().includes("already") && message.toLowerCase().includes("vote")) {
          toast("You have already voted for this event. Redirecting to results…", {
            icon: "ℹ️",
            duration: 2000,
          });
          setShowConfirmModal(false);
          // Delay redirect to allow toast to be visible
          setTimeout(() => {
            router.push(`/results/${eventId}`);
          }, 2000);
          return;
        }

        throw new Error(message || `Vote failed: ${res.status}`);
      }

      // Vote successful, redirect to results
      toast.success("Vote submitted successfully! Redirecting to results…", {
        duration: 2000,
      });
      setShowConfirmModal(false);
      // Delay redirect to allow toast to be visible
      setTimeout(() => {
        router.push(`/results/${eventId}`);
      }, 2000);
    } catch (err: any) {
      setVoteError(err?.message ?? "Failed to submit vote");
      toast.error(err?.message ?? "Failed to submit vote");
    } finally {
      setVoteLoading(false);
    }
  };

  // Simple static pie chart like list page
  const pieChart = [
    { color: "#3b82f6", percent: 40 },
    { color: "#eab308", percent: 30 },
    { color: "#84cc16", percent: 20 },
    { color: "#ef4444", percent: 10 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-300">
        Loading event...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-red-400">
        {error ?? "Event not found"}
      </div>
    );
  }

  let currentAngle = -90;
  const radius = 40;
  const centerX = 50;
  const centerY = 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-16">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-4 text-sm text-blue-300 hover:text-blue-200"
          >
            ← Back to Events
          </button>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {event.title}
          </h1>
          {event.category_name && (
            <p className="text-xs uppercase tracking-[0.15em] text-gray-300">
              {event.category_name}
            </p>
          )}
        </div>

        <div className="group bg-gradient-to-br from-purple-800/60 to-indigo-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/15 hover:border-white/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4 p-2 bg-purple-900/30 rounded-xl border border-purple-500/25 w-fit">
                <svg
                  className="w-4 h-4 text-purple-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-purple-100 font-mono text-sm">{countdown}</p>
              </div>

              <div className="text-xs text-gray-300 mb-4 space-y-1">
                <p>
                  Starts:{" "}
                  {new Date(event.start_date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  Ends:{" "}
                  {new Date(event.end_date).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-gray-100">
                <div
                  // description is stored as HTML
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            </div>

            <div className="flex-shrink-0 relative self-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <svg
                width="160"
                height="160"
                viewBox="0 0 100 100"
                className="drop-shadow-2xl relative z-10"
              >
                {pieChart.map((segment, segIdx) => {
                  const angle = (segment.percent / 100) * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;

                  const startAngleRad = (startAngle * Math.PI) / 180;
                  const endAngleRad = (endAngle * Math.PI) / 180;

                  const x1 = centerX + radius * Math.cos(startAngleRad);
                  const y1 = centerY + radius * Math.sin(startAngleRad);
                  const x2 = centerX + radius * Math.cos(endAngleRad);
                  const y2 = centerY + radius * Math.sin(endAngleRad);

                  const largeArcFlag = angle > 180 ? 1 : 0;

                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  currentAngle = endAngle;

                  return (
                    <path
                      key={segIdx}
                      d={pathData}
                      fill={segment.color}
                      stroke="#1e293b"
                      strokeWidth="0.5"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {eventOptions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Event Options
            </h2>
            <div className="grid md:grid-cols-2 gap-4"> 
              {eventOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className="group text-left bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 rounded-2xl" />
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors">
                      {option.name}
                    </h3>
                    {option.description && (
                      <div
                        className="ql-editor text-sm text-gray-300 prose prose-invert max-w-none line-clamp-1 [&_p]:my-0 [&_p]:inline [&_ul]:inline [&_li]:inline"
                        dangerouslySetInnerHTML={{ __html: option.description }}
                      />
                    )}
                    <p className="mt-3 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to login and vote on this option.
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {optionsLoading && (
          <div className="mt-8 text-center text-gray-400">Loading event options...</div>
        )}

        {showLoginModal && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowLoginModal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-white text-sm"
                onClick={() => setShowLoginModal(false)}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Login to vote
              </h2>
              {selectedOption && (
                <p className="text-sm text-gray-300 mb-4">
                  You are about to vote for{" "}
                  <span className="font-semibold text-white">{selectedOption.name}</span>.
                  Please login to continue.
                </p>
              )}

              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = String(formData.get("login-email") ?? "");
                  const password = String(formData.get("login-password") ?? "");

                  if (!email || !password) return;

                  try {
                    setLoginError(null);
                    setLoginLoading(true);

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
                    const verificationStatus = body?.data?.user?.verification_status as
                      | string
                      | undefined;

                    if (!token || !userId) {
                      throw new Error("Invalid login response");
                    }

                    if (typeof window !== "undefined") {
                      window.sessionStorage.setItem("Authorization", `Bearer ${token}`);
                      window.sessionStorage.setItem("UserId", userId);
                      if (verificationStatus) {
                        window.sessionStorage.setItem("VerificationStatus", verificationStatus);
                      }
                    }

                    setShowLoginModal(false);
                    if (verificationStatus === "unverified") {
                      setShowKycModal(true);
                    } else if (selectedOption) {
                      // If verified and option is selected, show confirmation modal
                      setShowConfirmModal(true);
                    }
                  } catch (err: any) {
                    setLoginError(err?.message ?? "Login failed");
                  } finally {
                    setLoginLoading(false);
                  }
                }}
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    name="login-email"
                    type="email"
                    required
                    className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    name="login-password"
                    type="password"
                    required
                    className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                {loginError && (
                  <p className="text-xs text-red-400">{loginError}</p>
                )}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-sm font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loginLoading ? "Logging in..." : "Login & continue"}
                </button>
              </form>

              <p className="mt-3 text-[11px] text-gray-500 text-center">
                Don&apos;t have an account yet? Voting requires a quick signup in the main app.
              </p>
            </div>
          </div>
        )}

        {showKycModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-amber-400/40 shadow-2xl p-6">
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-white text-sm"
                onClick={() => setShowKycModal(false)}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                KYC verification required
              </h2>
              <p className="text-sm text-gray-200 mb-4">
                Your account is currently{" "}
                <span className="font-semibold text-amber-300">not KYC verified</span>. To
                participate in voting for this event, please complete a quick KYC check.
              </p>

              <div className="space-y-3 text-xs text-gray-400 mb-4">
                <p>Verification helps us:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep voting fair and prevent duplicate accounts</li>
                  <li>Comply with local regulations</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowKycModal(false);
                  router.push("/kyc");
                }}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-sm font-semibold text-slate-900 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/40"
              >
                Continue to KYC
              </button>

              <button
                type="button"
                onClick={() => setShowKycModal(false)}
                className="w-full mt-2 px-4 py-2.5 rounded-lg border border-gray-600/60 text-sm font-medium text-gray-200 hover:bg-gray-800/60 transition-all"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-white text-sm"
                onClick={() => setShowConfirmModal(false)}
                disabled={voteLoading}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Confirm your vote
              </h2>
              {selectedOption && (
                <p className="text-sm text-gray-300 mb-4">
                  You are about to vote for{" "}
                  <span className="font-semibold text-white">{selectedOption.name}</span>.
                  This action cannot be undone.
                </p>
              )}

              {voteError && (
                <p className="text-xs text-red-400 mb-4">{voteError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleVoteSubmit}
                  disabled={voteLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-sm font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {voteLoading ? "Submitting..." : "Confirm & Vote"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={voteLoading}
                  className="px-4 py-2.5 rounded-lg border border-gray-600/60 text-sm font-medium text-gray-200 hover:bg-gray-800/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

