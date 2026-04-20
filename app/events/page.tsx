"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  const getRemainingMs = (event: Event, currentTimeMs: number) => {
    const end = new Date(event.end_date).getTime();
    return Math.max(end - currentTimeMs, 0);
  };

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const url = `${baseUrl}/api/events/by-status?status=active`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load events: ${res.status}`);
        return res.json();
      })
      .then((data: Event[]) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message ?? "Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  // Tick every second so countdowns (and ordering) update continuously
  useEffect(() => {
    const id = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();

    const base = !term
      ? [...events]
      : events.filter((e) => {
      return (
        e.title.toLowerCase().includes(term) ||
        (e.description ?? "").toLowerCase().includes(term) ||
        (e.category_name ?? "").toLowerCase().includes(term)
      );
      });

    // Sort by least remaining time until end first
    return base.sort((a, b) => getRemainingMs(a, nowMs) - getRemainingMs(b, nowMs));
  }, [events, search, nowMs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050515] via-[#1c2248] to-[#050515] text-white px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "52px 52px",
          }}
        />
      </div>
      <div
        className="absolute right-0 top-1/3 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(30, 64, 175, 0.18) 45%, transparent 100%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Active Events
          </h1>
          <p className="text-gray-300">
            Browse all currently active events and filter them using the search bar.
          </p>
        </header>

        <div className="mb-8">
          <div className="flex items-center bg-blue-950/35 backdrop-blur-sm rounded-xl p-3 border border-blue-300/20 shadow-xl shadow-blue-900/40 relative overflow-hidden group hover:border-blue-300/40 transition-all max-w-xl">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
            <svg
              className="w-5 h-5 mr-3 text-cyan-200 group-hover:text-cyan-100 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, or category..."
              className="flex-1 bg-transparent outline-none text-slate-200 placeholder-slate-400 text-sm focus:placeholder-slate-500 transition-colors"
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Showing {filteredEvents.length} of {events.length} active events
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading events...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No events match your search.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              // Simple static pie chart like the homepage
              const pieChart = [
                { color: "#3b82f6", percent: 40 }, // Blue
                { color: "#eab308", percent: 30 }, // Yellow
                { color: "#84cc16", percent: 20 }, // Green
                { color: "#ef4444", percent: 10 }, // Red
              ];

              let currentAngle = -90;
              const radius = 40;
              const centerX = 50;
              const centerY = 50;

              // Basic "Ends in DD:HH:MM:SS" countdown (using end_date and ticking nowMs)
              const diffMs = getRemainingMs(event, nowMs);
              const totalSeconds = Math.floor(diffMs / 1000);
              const days = Math.floor(totalSeconds / (24 * 3600));
              const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
              const minutes = Math.floor((totalSeconds % 3600) / 60);
              const seconds = totalSeconds % 60;
              const countdown = `Ends in ${String(days).padStart(2, "0")}:${String(
                hours
              ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
                seconds
              ).padStart(2, "0")}`;

              return (
                <div
                  key={event.id ?? idx}
                  className="group bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-indigo-900/60 backdrop-blur-sm rounded-3xl p-6 border border-blue-200/15 hover:border-blue-200/30 transition-all duration-300 relative overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-700/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-indigo-400/0 group-hover:from-cyan-400/10 group-hover:to-indigo-400/10 transition-all duration-300 rounded-3xl" />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1 group-hover:text-cyan-100 transition-colors">
                        {event.title}
                      </h2>
                      {event.category_name && (
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-300 mb-3">
                          {event.category_name}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-4 p-2 bg-blue-950/40 rounded-xl border border-blue-300/20">
                        <svg
                          className="w-4 h-4 text-cyan-200"
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
                        <p className="text-cyan-100 font-mono text-sm">{countdown}</p>
                      </div>
                      <Link href={`/events/${event.id}`}>
                      <button className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg transition-all font-semibold hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-cyan-500/35 transform hover:scale-105">
                        View Event
                      </button>
                      </Link>
                    </div>
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        className="drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-300"
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

