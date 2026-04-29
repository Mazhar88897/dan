"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

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

function parseCategoriesPayload(data: unknown): Category[] {
  const raw = Array.isArray(data) ? data : (data as { data?: unknown }).data;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (c): c is Category =>
      c !== null &&
      typeof c === "object" &&
      typeof (c as Category).id === "string" &&
      typeof (c as Category).name === "string",
  );
}

const EVENT_STATUSES = ["upcoming", "active", "completed"] as const;

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "") || "http://localhost:3000";
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

export default function SuperAdminCrudPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterVisibility, setFilterVisibility] = useState<"all" | "public" | "private">("all");
  const [filterWhiteLabel, setFilterWhiteLabel] = useState<"all" | "yes" | "no">("all");
  const [filterEventType, setFilterEventType] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    const auth =
      typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;
    if (!auth) {
      setLoading(false);
      router.replace("/super-admin/auth");
      return;
    }

    setLoading(true);
    setError(null);
    setCategoriesError(null);

    const headers = { Authorization: auth };

    const settled = await Promise.allSettled([
      fetch(`${apiBase()}/api/categories/`, { headers }).then(async (res) => {
        if (!res.ok) throw new Error(`categories: ${res.status}`);
        const data: unknown = await res.json();
        return parseCategoriesPayload(data);
      }),
      ...EVENT_STATUSES.map((status) =>
        fetch(`${apiBase()}/api/events/by-status?status=${encodeURIComponent(status)}`, {
          headers,
        }).then((res) => {
          if (!res.ok) throw new Error(`${status}: ${res.status}`);
          return res.json() as Promise<Event[]>;
        }),
      ),
    ]);

    const catResult = settled[0];
    if (catResult.status === "fulfilled") {
      setCategories(catResult.value as Category[]);
    } else {
      setCategories([]);
      const msg =
        catResult.reason instanceof Error ? catResult.reason.message : String(catResult.reason);
      setCategoriesError(msg);
    }

    const byId = new Map<string, Event>();
    const failures: string[] = [];

    for (let i = 0; i < EVENT_STATUSES.length; i++) {
      const r = settled[i + 1];
      const status = EVENT_STATUSES[i];
      if (r.status === "fulfilled") {
        const data = r.value as Event[];
        const arr = Array.isArray(data) ? data : [];
        for (const e of arr) {
          if (e?.id) byId.set(e.id, e);
        }
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        failures.push(`${status} (${msg})`);
      }
    }

    const merged = [...byId.values()].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    setEvents(merged);

    if (merged.length === 0 && failures.length > 0) {
      setError(failures.join(" · "));
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    for (const s of EVENT_STATUSES) set.add(s);
    for (const e of events) {
      if (e.status?.trim()) set.add(e.status.trim().toLowerCase());
    }
    return [...set].sort();
  }, [events]);

  const categoriesSorted = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  const eventTypeOptions = useMemo(() => {
    const types = new Set<string>();
    for (const e of events) {
      const t = e.event_type?.trim();
      if (t) types.add(t);
    }
    return [...types].sort((a, b) => a.localeCompare(b));
  }, [events]);

  const hasActiveFilters =
    search.trim() !== "" ||
    filterStatus !== "" ||
    filterCategory !== "" ||
    filterVisibility !== "all" ||
    filterWhiteLabel !== "all" ||
    filterEventType !== "";

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterCategory("");
    setFilterVisibility("all");
    setFilterWhiteLabel("all");
    setFilterEventType("");
  };

  const filteredEvents = useMemo(() => {
    const selectedCat =
      filterCategory && filterCategory !== "__uncategorized__"
        ? categories.find((c) => c.id === filterCategory)
        : null;

    const term = search.trim().toLowerCase();
    return events.filter((e) => {
      if (term) {
        const hay =
          `${e.title} ${e.description ?? ""} ${e.category_name ?? ""} ${e.category_id ?? ""} ${e.status ?? ""} ${e.event_type ?? ""} ${e.id}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (filterStatus) {
        const s = (e.status ?? "").trim().toLowerCase();
        if (s !== filterStatus.toLowerCase()) return false;
      }
      if (filterCategory) {
        if (filterCategory === "__uncategorized__") {
          if ((e.category_id ?? "").trim() || (e.category_name ?? "").trim()) return false;
        } else {
          const idMatch = (e.category_id ?? "").trim() === filterCategory;
          const nameMatch =
            !!selectedCat &&
            !(e.category_id ?? "").trim() &&
            (e.category_name ?? "").trim() === selectedCat.name;
          if (!idMatch && !nameMatch) return false;
        }
      }
      if (filterVisibility === "public" && !e.is_public) return false;
      if (filterVisibility === "private" && e.is_public) return false;
      if (filterWhiteLabel === "yes" && !e.is_white_label) return false;
      if (filterWhiteLabel === "no" && e.is_white_label) return false;
      if (filterEventType && (e.event_type ?? "").trim() !== filterEventType) return false;
      return true;
    });
  }, [
    events,
    search,
    filterStatus,
    filterCategory,
    filterVisibility,
    filterWhiteLabel,
    filterEventType,
    categories,
  ]);

  const selectClass =
    "rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50";

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
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              All events
            </h1>
            <p className="mt-1 text-sm text-white/55">
              Merged from upcoming, active, and completed. Delete only — no editing here.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void loadEvents()}
              disabled={loading}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
            >
              Refresh
            </button>
            <Link
              href="/super-admin/users"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white/90"
            >
              Users
            </Link>
            <Link
              href="/super-admin/countries"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white/90"
            >
              Countries
            </Link>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:text-white/90"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/45">Filters</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 sm:self-auto"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">Search</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, id, type, category, status…"
                className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">Status</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={loading}
                className={selectClass}
              >
                <option value="">All statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">Category</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                disabled={loading}
                className={selectClass}
              >
                <option value="">All categories</option>
                <option value="__uncategorized__">Uncategorized</option>
                {categoriesSorted.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {categoriesError && (
                <span className="text-[11px] text-amber-300/90">Categories: {categoriesError}</span>
              )}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">Visibility</span>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value as "all" | "public" | "private")}
                disabled={loading}
                className={selectClass}
              >
                <option value="all">Public & private</option>
                <option value="public">Public only</option>
                <option value="private">Private only</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">White label</span>
              <select
                value={filterWhiteLabel}
                onChange={(e) => setFilterWhiteLabel(e.target.value as "all" | "yes" | "no")}
                disabled={loading}
                className={selectClass}
              >
                <option value="all">All</option>
                <option value="yes">White label</option>
                <option value="no">Not white label</option>
              </select>
            </label>
            {/* <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">Event type</span>
              <select
                value={filterEventType}
                onChange={(e) => setFilterEventType(e.target.value)}
                disabled={loading}
                className={selectClass}
              >
                <option value="">All types</option>
                {eventTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label> */}
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            {error}
          </p>
        )}

        {loading ? (
          <div className="py-20 text-center text-white/55">Loading events and categories…</div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-sm text-white/55">No events match your filters.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
                    <th className="w-14 px-3 py-3 text-center font-medium">Sr no.</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Starts</th>
                    <th className="px-4 py-3 font-medium">Ends</th>
                    <th className="w-14 px-4 py-3 font-medium text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEvents.map((event, index) => (
                    <tr key={event.id} className="text-white/85 transition hover:bg-white/[0.04]">
                      <td className="px-3 py-3 text-center tabular-nums text-white/55">{index + 1}</td>
                      <td className="max-w-[240px] px-4 py-3">
                        <span className="line-clamp-2 font-medium text-white">{event.title}</span>
                        <p className="mt-0.5 font-mono text-[10px] text-white/35">{event.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        {event.status ? (
                          <span className="inline-block rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2 py-0.5 text-xs capitalize text-emerald-200">
                            {event.status}
                          </span>
                        ) : (
                          <span className="text-white/35">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/70">{event.category_name ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-white/60">
                        {new Date(event.start_date).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-white/60">
                        {new Date(event.end_date).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setConfirmDelete({ id: event.id, title: event.title })}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-red-300/90 transition hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
                          title="Delete event"
                          aria-label="Delete event"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-white/35">
          {events.length} event{events.length === 1 ? "" : "s"} loaded
          {categories.length > 0 ? ` · ${categories.length} categories from API` : ""}
          {hasActiveFilters ? ` · ${filteredEvents.length} match filters` : ""}
        </p>
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
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1234]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h2 id="logout-dialog-title" className="text-lg font-semibold text-white">
              Log out?
            </h2>
            <p className="mt-2 text-sm text-white/65">
              You will need to sign in again to use the super admin tools.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") window.sessionStorage.clear();
                  setLogoutOpen(false);
                  router.push("/super-admin/auth");
                }}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-purple-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
