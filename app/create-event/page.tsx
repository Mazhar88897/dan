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

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "") || "http://localhost:3000";
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export default function CreateEventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadEvents = () => {
    const userId =
      typeof window !== "undefined" ? window.sessionStorage.getItem("UserId") : null;

    if (!userId) {
      setLoading(false);
      setError("You must be signed in to view your events.");
      return;
    }

    setLoading(true);
    setError(null);
    const url = `${apiBase()}/api/events/by-created-by?created_by=${encodeURIComponent(userId)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load your events: ${res.status}`);
        return res.json();
      })
      .then((data: Event[]) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message ?? "Failed to load your events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;

    return events.filter((e) => {
      return (
        e.title.toLowerCase().includes(term) ||
        (e.description ?? "").toLowerCase().includes(term) ||
        (e.category_name ?? "").toLowerCase().includes(term)
      );
    });
  }, [events, search]);

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const auth =
      typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      const url = `${apiBase()}/api/events/${encodeURIComponent(confirmDelete.id)}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          ...(auth ? { Authorization: auth } : {}),
        },
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          (errBody as { message?: string }).message ?? `Delete failed: ${res.status}`,
        );
      }
      setEvents((prev) => prev.filter((e) => e.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050515] font-sans text-white antialiased">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(88,28,135,0.35)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-[60%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.4)_0%,transparent_60%)] blur-3xl" />
        <div
          className="absolute right-0 top-1/3 h-[420px] w-[420px] translate-x-1/4 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(30, 64, 175, 0.14) 45%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.75) 1px, transparent 0)",
            backgroundSize: "52px 52px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              Create Event
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/65">
              Start a new global poll or event, and manage the ones you&apos;ve already created.
            </p>
          </div>
          <Link href="/create-event/create-form">
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:from-blue-600 hover:to-cyan-600"
            >
              Create a new event
            </button>
          </Link>
        </div>

        <div className="mb-8 max-w-xl">
          <div className="group relative flex items-center overflow-hidden rounded-xl border border-blue-300/20 bg-blue-950/35 p-3 shadow-xl shadow-blue-900/40 backdrop-blur-sm transition hover:border-blue-300/40">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
            <svg
              className="mr-3 h-5 w-5 shrink-0 text-cyan-200 transition group-hover:text-cyan-100"
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
              placeholder="Search your events by title, description, or category..."
              className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-400"
            />
          </div>
          <p className="mt-2 text-xs text-white/45">
            Showing {filteredEvents.length} of {events.length} events you&apos;ve created
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-white/55">Loading your events...</div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-300">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-sm text-white/55">
            You haven&apos;t created any events yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-2xl border border-blue-200/15 bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-indigo-900/60 p-5 backdrop-blur-sm transition duration-300 hover:border-blue-200/30 hover:shadow-2xl hover:shadow-blue-700/25"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-indigo-400/0 transition duration-300 group-hover:from-cyan-400/10 group-hover:to-indigo-400/10" />
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h2 className="line-clamp-2 flex-1 text-lg font-semibold text-white transition group-hover:text-cyan-100">
                      {event.title}
                    </h2>
                    <div className="flex shrink-0 items-center gap-1">
                      <Link
                        href={`/create-event/edit/${encodeURIComponent(event.id)}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-cyan-200 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-100"
                        title="Edit event"
                        aria-label="Edit event"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDelete({ id: event.id, title: event.title })
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-red-300/90 transition hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
                        title="Delete event"
                        aria-label="Delete event"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {event.status && (
                    <span className="w-fit rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-emerald-300">
                      {event.status}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {event.category_name && (
                      <p className="rounded-full bg-white/10 px-2 py-1 text-center text-[11px] font-semibold text-cyan-100">
                        {event.category_name}
                      </p>
                    )}
                  </div>
                  {event.description && (
                    <div
                      className="ql-editor prose prose-invert line-clamp-2 max-w-none overflow-hidden text-xs text-white/60 [&_li]:inline [&_p]:my-0 [&_p]:inline [&_ul]:inline"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                  <p className="mt-2 text-[11px] text-white/45">
                    Starts:{" "}
                    {new Date(event.start_date).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <Link
                    href={`/create-event/create-form/options?event_id=${encodeURIComponent(event.id)}`}
                    className="mt-2 inline-block text-xs font-medium text-cyan-300/90 hover:text-cyan-200"
                  >
                    Manage options →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1234]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h2 id="delete-dialog-title" className="text-lg font-semibold text-white">
              Delete event?
            </h2>
            <p className="mt-2 text-sm text-white/65">
              This cannot be undone.{" "}
              <span className="font-medium text-white/90">&quot;{confirmDelete.title}&quot;</span>
            </p>
            {deleteError && <p className="mt-3 text-sm text-red-300">{deleteError}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setConfirmDelete(null);
                  setDeleteError(null);
                }}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => void handleConfirmDelete()}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
