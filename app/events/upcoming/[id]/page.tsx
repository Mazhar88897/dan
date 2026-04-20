"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

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

  const heroDescription = useMemo(() => {
    if (!event?.description) return "";
    const text = stripHtml(event.description);
    return text.length > 180 ? `${text.slice(0, 177)}...` : text;
  }, [event?.description]);

  // Simple static pie chart like list page
  const pieChart = [
    { color: "#3b82f6", percent: 40 },
    { color: "#eab308", percent: 30 },
    { color: "#84cc16", percent: 20 },
    { color: "#ef4444", percent: 10 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050515] font-sans text-white">
        <p className="text-white/60">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050515] px-6 font-sans text-white">
        <p className="text-center text-red-300">{error ?? "Event not found"}</p>
        <Link
          href="/events"
          className="rounded-xl border border-white/20 px-5 py-2.5 text-sm text-white/90 hover:bg-white/10"
        >
          Back to events
        </Link>
      </div>
    );
  }

  let currentAngle = -90;
  const radius = 40;
  const centerX = 50;
  const centerY = 50;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050515] font-sans text-white antialiased">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(88,28,135,0.35)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-[60%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.4)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-1/2 w-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(49,46,129,0.25)_0%,transparent_70%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,255,255,0.9), transparent),
              radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.7), transparent),
              radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.5), transparent),
              radial-gradient(1.5px 1.5px at 90% 70%, rgba(255,255,255,0.8), transparent)`,
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            ← Back to Events
          </button>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(280px,1.1fr)] lg:gap-6">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <div className="inline-flex flex-wrap items-center gap-3 py-2.5 text-sm backdrop-blur-md">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/15 px-2.5 py-1 text-xs font-medium text-amber-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                UPCOMING
              </span>
              <span className="text-white/70">Ends in</span>
              <span className="tabular-nums tracking-wide text-white">{countdown.replace("Ends in ", "")}</span>
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[2.75rem] lg:leading-tight">
                {event.title}
              </h1>
              {heroDescription ? (
                <p className="mt-3 max-w-xl text-base text-white/65 sm:text-lg">{heroDescription}</p>
              ) : null}
              {event.category_name && (
                <p className="mt-4 text-xs uppercase tracking-[0.15em] text-white/60">{event.category_name}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("options")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(59,130,246,0.4)] transition hover:from-blue-500 hover:to-blue-400"
              >
                Explore Options
              </button>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/10"
              >
                View all events
              </Link>
            </div>
          </div>

          <div className="hidden sm:block relative order-1 flex min-h-[280px] justify-center lg:order-2 lg:min-h-[420px]">
            <div
              className="pointer-events-none absolute right-0 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-y-1/2 translate-x-[15%] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.25)_0%,rgba(59,130,246,0.12)_35%,transparent_65%)] blur-2xl"
              aria-hidden
            />
            <div className="relative pt-16 aspect-square w-full max-w-[min(100%,420px)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 rounded-full blur-xl" />
              <svg
                width="160"
                height="160"
                viewBox="0 0 100 100"
                className="h-full w-full drop-shadow-2xl relative z-10"
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

        <section className="mt-14 lg:mt-16">
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0c1234]/35 px-6 py-8 backdrop-blur-xl sm:px-8 sm:py-10">
            <h2 className="mb-6 text-center text-lg font-semibold text-white sm:text-xl">Event overview</h2>
            <div className="grid gap-4 text-sm text-white/70 sm:grid-cols-2">
              <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-white/50">Starts:</span>{" "}
                {new Date(event.start_date).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-white/50">Ends:</span>{" "}
                {new Date(event.end_date).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 prose prose-invert max-w-none text-white/85">
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            </div>
          </div>
        </section>

        <section id="options" className="mt-14 lg:mt-16">
          <h2 className="mb-5 text-3xl font-semibold tracking-tight text-white">Options Description</h2>

          {optionsLoading ? (
            <p className="text-sm text-white/60">Loading event options...</p>
          ) : eventOptions.length === 0 ? (
            <p className="text-sm text-white/60">No options available for this event yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {eventOptions.map((option) => (
                <div
                  key={option.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101742]/45 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-2xl" />
                  <div className="relative z-10">
                    <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {option.name}
                    </h3>
                    {option.description ? (
                      <div
                        className="text-sm leading-relaxed text-white/70 [&_a]:text-blue-400 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{ __html: option.description }}
                      />
                    ) : (
                      <p className="text-sm text-white/50">No description provided for this option.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

