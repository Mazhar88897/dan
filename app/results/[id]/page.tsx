"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type OptionResult = {
  option_id: string;
  name: string;
  description: string;
  count: number;
  percentage: number;
};

type EventResultsResponse = {
  event_id?: string;
  event_title?: string;
  event_description?: string; // may contain HTML
  status?: string;
  total_votes: number;
  options: OptionResult[];
};

const CHART_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber / orange
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
];

export default function ResultsPage() {
  const params = useParams();
  const eventId = typeof params?.id === "string" ? params.id : "";
  const [data, setData] = useState<EventResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openOptionIds, setOpenOptionIds] = useState<Set<string>>(new Set());

  const toggleOption = (id: string) => {
    setOpenOptionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      setError("Missing event ID");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const url = `${baseUrl}/api/votes/event-results?event_id=${encodeURIComponent(eventId)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load results: ${res.status}`);
        return res.json();
      })
      .then((body: EventResultsResponse) => {
        setData(body);
        setError(null);
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to load results");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050515] font-sans text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
          <p className="text-white/65">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050515] px-6 font-sans text-white">
        <div className="max-w-md text-center">
          <p className="mb-4 text-red-300">{error ?? "No data"}</p>
          <Link
            href="/events"
            className="inline-block rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-white/90 transition hover:bg-white/10"
          >
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const options = data.options ?? [];
  const totalVotes = data.total_votes ?? 0;
  const isComplete = (data.status ?? "").toLowerCase() === "complete";

  // Pie chart: include all options. 100% = full circle; 0% = thin stripe (~1°)
  const centerX = 50;
  const centerY = 50;
  const radius = 45;
  const MIN_ANGLE = 3; // degrees for 0% options (thin stripe)

  const pieChart = options.map((opt, i) => ({
    percent: Math.max(0, Math.min(100, opt.percentage ?? 0)),
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const numZeros = pieChart.filter((s) => s.percent === 0).length;
  const remainingAngle = 360 - numZeros * MIN_ANGLE;

  let currentAngle = -90; // start at 12 o'clock
  const pieSegments = pieChart.map((segment) => {
    const displayAngle =
      segment.percent === 0 ? MIN_ANGLE : (segment.percent / 100) * remainingAngle;
    const startAngle = currentAngle;
    const endAngle = currentAngle + displayAngle;
    currentAngle = endAngle;
    return { ...segment, startAngle, endAngle };
  });

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

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/events"
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            ← Back to events
          </Link>
          {isComplete && (
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
              Complete
            </span>
          )}
        </div>

        <section className="rounded-3xl border border-white/15 bg-[#0c1234]/35 px-6 py-8 backdrop-blur-xl sm:px-8 sm:py-10">
          <h1 className="mb-2 bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            {data.event_title ?? "Event results"}
          </h1>

          <p className="mb-8 text-white/65">
            Total votes: <span className="font-medium text-white">{totalVotes}</span>
          </p>

          {/* Pie chart */}
          <div className="mb-8 flex flex-col items-center gap-10 md:flex-row md:items-start">
            <div className="relative self-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 blur-xl" />
              <div className="relative h-[170px] w-[170px]">
              <svg
                width="170"
                height="170"
                viewBox="0 0 100 100"
                className="drop-shadow-2xl relative z-10"
              >
                {pieSegments.map((segment, segIdx) => {
                    const startAngleRad = (segment.startAngle * Math.PI) / 180;
                    const endAngleRad = (segment.endAngle * Math.PI) / 180;

                    const x1 = centerX + radius * Math.cos(startAngleRad);
                    const y1 = centerY + radius * Math.sin(startAngleRad);
                    const x2 = centerX + radius * Math.cos(endAngleRad);
                    const y2 = centerY + radius * Math.sin(endAngleRad);

                    const angle = segment.endAngle - segment.startAngle;
                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ");

                    return (
                      <path
                        key={segIdx}
                        d={pathData}
                        fill={segment.color}
                        stroke="#101b45"
                        strokeWidth="0.5"
                      />
                    );
                  })}
              </svg>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white drop-shadow-2xl relative z-10">
                  {totalVotes}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <ul className="w-full space-y-3">
              {options.map((opt, i) => (
                <li
                  key={opt.option_id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span
                    className="h-4 w-4 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="flex-1 text-gray-200">{opt.name}</span>
                  <span className="tabular-nums font-semibold text-white">
                    {opt.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">({opt.count})</span>
                </li>
              ))}
            </ul>
          </div>

          {data.event_description && (
            <div
              className="mb-2 prose prose-invert max-w-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/80 prose-p:my-1 prose-a:text-indigo-400 prose-ul:my-2 prose-ol:my-2"
              dangerouslySetInnerHTML={{ __html: data.event_description }}
            />
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">Option details</h2>
          <div className="space-y-2">
          {options.map((opt, i) => {
            const isOpen = openOptionIds.has(opt.option_id);
            const hasDescription = !!opt.description?.trim();
            return (
              <div
                key={opt.option_id}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#101742]/45 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleOption(opt.option_id)}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/5"
                  aria-expanded={isOpen}
                  aria-controls={`option-desc-${opt.option_id}`}
                  id={`option-head-${opt.option_id}`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="font-medium text-white flex-1">{opt.name}</span>
                  <span className="text-sm text-gray-400">
                    {opt.count} votes · {opt.percentage.toFixed(1)}%
                  </span>
                  {hasDescription && (
                    <svg
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                {hasDescription && (
                  <div
                    id={`option-desc-${opt.option_id}`}
                    role="region"
                    aria-labelledby={`option-head-${opt.option_id}`}
                    className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div
                        className="max-w-none border-t border-white/10 px-4 pb-4 pl-[1.75rem] pt-3 text-sm text-gray-300 prose prose-invert prose-sm prose-p:my-1 prose-a:text-indigo-400 prose-ul:my-2 prose-ol:my-2"
                        dangerouslySetInnerHTML={{ __html: opt.description }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </section>
      </div>
    </div>
  );
}
