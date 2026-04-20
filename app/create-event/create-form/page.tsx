"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { FormEvent, useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  children: unknown[];
};

function CreateFormThemedLayout({ children }: { children: ReactNode }) {
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
      <div className="relative z-10 mx-auto max-w-2xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">{children}</div>
    </div>
  );
}

function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

export default function CreateEventFormPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Hardcoded values
  const eventType = "poll";
  const isPublic = true;
  const [isWhiteLabel, setIsWhiteLabel] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const url = `${baseUrl || "http://localhost:3000"}/api/categories`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((data: Category[]) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const createdBy =
      typeof window !== "undefined" ? window.sessionStorage.getItem("UserId") : null;
    if (!createdBy) {
      setSubmitError("You must be signed in to create an event.");
      return;
    }

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

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const url = `${baseUrl || "http://localhost:3000"}/api/events`;
      const auth =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("Authorization")
          : null;

      const body = {
        title: title.trim(),
        description: description.trim() || undefined,
        event_type: eventType,
        is_public: isPublic,
        is_white_label: isWhiteLabel,
        category_id: categoryId,
        created_by: createdBy,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message ?? `Create failed: ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      const createdId = data?.id ?? data?.event_id;
      if (createdId) {
        router.push(`/create-event/create-form/options?event_id=${encodeURIComponent(createdId)}`);
      } else {
        router.push("/create-event");
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <CreateFormThemedLayout>
      <BackLink href="/create-event">← Back to your events</BackLink>
      <h1 className="mt-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
        Create a new event
      </h1>
      <p className="mt-2 text-sm text-white/65">
        Fill in the details below. Use the rich text editor for formatting.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-3xl border border-white/15 bg-[#0c1234]/35 p-6 backdrop-blur-xl sm:p-8"
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
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/45"
            placeholder="My Event Title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90" htmlFor="description">
            Description
          </label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Describe your event. Use the toolbar for bold, lists, links, etc."
          />
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
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/45 disabled:opacity-60"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categoriesLoading && (
            <p className="text-xs text-white/50">Loading categories...</p>
          )}
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
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/45 [color-scheme:dark]"
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
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/45 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isWhiteLabel}
                onChange={(e) => setIsWhiteLabel(e.target.checked)}
                className="rounded border-white/20 bg-slate-800 text-blue-400 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-200">White label</span>
            </label>
          </div> */}

        {submitError && <p className="text-sm text-red-300">{submitError}</p>}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={submitLoading}
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.3)] transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? "Creating..." : "Create event"}
          </button>
          <Link
            href="/create-event"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white/90 transition hover:bg-white/10 sm:flex-none sm:min-w-[120px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </CreateFormThemedLayout>
  );
}
