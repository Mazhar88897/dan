"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import RichTextEditor from "../../create-form/RichTextEditor";

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  children: unknown[];
};

type EventApi = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  is_public: boolean;
  is_white_label: boolean;
  category_id: string | null;
  start_date: string;
  end_date: string;
};

function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "") || "http://localhost:3000";
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("poll");
  const [isPublic, setIsPublic] = useState(true);
  const [isWhiteLabel, setIsWhiteLabel] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const url = `${apiBase()}/api/categories`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((data: Category[]) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    if (!eventId) {
      setEventLoading(false);
      setLoadError("Missing event id");
      return;
    }

    const auth =
      typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;
    const url = `${apiBase()}/api/events/${encodeURIComponent(eventId)}`;

    setEventLoading(true);
    setLoadError(null);
    fetch(url, {
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load event: ${res.status}`);
        return res.json();
      })
      .then((ev: EventApi) => {
        setTitle(ev.title ?? "");
        setDescription(ev.description ?? "");
        setEventType(ev.event_type ?? "poll");
        setIsPublic(Boolean(ev.is_public));
        setIsWhiteLabel(Boolean(ev.is_white_label));
        setCategoryId(ev.category_id ?? "");
        setStartDate(isoToDatetimeLocal(ev.start_date));
        setEndDate(isoToDatetimeLocal(ev.end_date));
      })
      .catch((err) => setLoadError(err?.message ?? "Failed to load event"))
      .finally(() => setEventLoading(false));
  }, [eventId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    const auth =
      typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;

    if (!categoryId) {
      setSubmitError("Please select a category.");
      return;
    }
    if (!startDate || !endDate) {
      setSubmitError("Please set both start and end date/time.");
      return;
    }

    try {
      setSubmitError(null);
      setSubmitLoading(true);

      const url = `${apiBase()}/api/events/${encodeURIComponent(eventId)}`;
      const body = {
        title: title.trim(),
        description: description.trim() || undefined,
        event_type: eventType,
        is_public: isPublic,
        is_white_label: isWhiteLabel,
        category_id: categoryId,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      };

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          (errData as { message?: string }).message ?? `Save failed: ${res.status}`,
        );
      }

      router.push("/create-event");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (eventLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050515] font-sans text-white">
        <p className="text-white/60">Loading event...</p>
      </div>
    );
  }

  if (loadError || !eventId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050515] px-6 font-sans text-white">
        <p className="text-center text-red-300">{loadError ?? "Invalid event"}</p>
        <Link
          href="/create-event"
          className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-white/90 hover:bg-white/10"
        >
          Back to your events
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050515] font-sans text-white antialiased">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(88,28,135,0.35)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-[60%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.4)_0%,transparent_60%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,255,255,0.9), transparent),
              radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.7), transparent)`,
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-5 pb-24 pt-8 sm:px-8">
        <div className="mb-8">
          <Link
            href="/create-event"
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            ← Back to your events
          </Link>
          <h1 className="mt-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Edit event
          </h1>
          <p className="mt-2 text-sm text-white/65">
            Update details and save. Changes are sent to the server when you click Save.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/15 bg-[#0c1234]/35 p-6 backdrop-blur-xl sm:p-8"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Event title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90" htmlFor="description">
              Description
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Describe your event..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90" htmlFor="event_type">
              Event type
            </label>
            <input
              id="event_type"
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="poll"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-white/20 bg-black/30 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span className="text-sm text-white/85">Public event</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isWhiteLabel}
                onChange={(e) => setIsWhiteLabel(e.target.checked)}
                className="rounded border-white/20 bg-black/30 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span className="text-sm text-white/85">White label</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90" htmlFor="category_id">
              Category
            </label>
            <select
              id="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={categoriesLoading}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categoriesLoading && <p className="text-xs text-white/50">Loading categories...</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90" htmlFor="start_date">
                Start date & time
              </label>
              <input
                id="start_date"
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90" htmlFor="end_date">
                End date & time
              </label>
              <input
                id="end_date"
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 [color-scheme:dark]"
              />
            </div>
          </div>

          {submitError && <p className="text-sm text-red-300">{submitError}</p>}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="min-w-[140px] flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitLoading ? "Saving..." : "Save changes"}
            </button>
            <Link
              href="/create-event"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-white/90 transition hover:bg-white/10"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
