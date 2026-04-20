"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { FormEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

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

function OptionsThemedLayout({ children }: { children: ReactNode }) {
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
      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">{children}</div>
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

export default function CreateEventOptionsPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  const [event, setEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);

  const [options, setOptions] = useState<EventOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myEventsLoading, setMyEventsLoading] = useState(false);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const auth =
    typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(auth ? { Authorization: auth } : {}),
  };

  // Fetch event when event_id is set
  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      setEventError(null);
      return;
    }
    setEventLoading(true);
    setEventError(null);
    fetch(`${baseUrl || "http://localhost:3000"}/api/events/${eventId}`, { headers: auth ? { Authorization: auth } : {} })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load event: ${res.status}`);
        return res.json();
      })
      .then((data: Event) => setEvent(data ?? null))
      .catch((err) => setEventError(err?.message ?? "Failed to load event"))
      .finally(() => setEventLoading(false));
  }, [eventId, auth]);

  // Fetch options for this event
  useEffect(() => {
    if (!eventId) {
      setOptions([]);
      return;
    }
    setOptionsLoading(true);
    setOptionsError(null);
    fetch(
      `${baseUrl || "http://localhost:3000"}/api/event-options/by-event?event_id=${encodeURIComponent(eventId)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load options: ${res.status}`);
        return res.json();
      })
      .then((data: EventOption[]) => setOptions(Array.isArray(data) ? data : []))
      .catch((err) => {
        setOptionsError(err?.message ?? "Failed to load options");
        setOptions([]);
      })
      .finally(() => setOptionsLoading(false));
  }, [eventId, baseUrl]);

  // Fetch user's events when no event_id (to show "select event" list)
  useEffect(() => {
    if (eventId) return;
    const userId =
      typeof window !== "undefined" ? window.sessionStorage.getItem("UserId") : null;
    if (!userId) {
      setMyEventsLoading(false);
      return;
    }
    setMyEventsLoading(true);
    fetch(
      `${baseUrl}/api/events/by-created-by?created_by=${encodeURIComponent(userId)}`
    )
      .then((res) => res.ok ? res.json() : [])
      .then((data: Event[]) => setMyEvents(Array.isArray(data) ? data : []))
      .catch(() => setMyEvents([]))
      .finally(() => setMyEventsLoading(false));
  }, [eventId, baseUrl]);

  const reloadOptions = () => {
    if (!eventId) return;
    fetch(
      `${baseUrl || "http://localhost:3000"}/api/event-options/by-event?event_id=${encodeURIComponent(eventId)}`
    )
      .then((res) => res.ok ? res.json() : [])
      .then((data: EventOption[]) => setOptions(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    const name = formName.trim();
    if (!name) {
      setSubmitError("Option name is required.");
      return;
    }
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      if (editingId) {
        const res = await fetch(
          `${baseUrl || "http://localhost:3000"}/api/event-options/${editingId}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({ name, description: formDescription.trim() || undefined }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message ?? `Update failed: ${res.status}`);
        }
        setEditingId(null);
      } else {
        const res = await fetch(
          `${baseUrl || "http://localhost:3000"}/api/event-options`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              event_id: eventId,
              name,
              description: formDescription.trim() || undefined,
            }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message ?? `Create failed: ${res.status}`);
        }
      }
      setFormName("");
      setFormDescription("");
      reloadOptions();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const startEdit = (opt: EventOption) => {
    setEditingId(opt.id);
    setFormName(opt.name);
    setFormDescription(opt.description ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormName("");
    setFormDescription("");
  };

  const handleDelete = async (id: string) => {
    if (!eventId || !confirm("Delete this option?")) return;
    try {
      const res = await fetch(
        `${baseUrl || "http://localhost:3000"}/api/event-options/${id}`,
        { method: "DELETE", headers: auth ? { Authorization: auth } : {} }
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      reloadOptions();
    } catch {
      setSubmitError("Failed to delete option.");
    }
  };

  if (!eventId) {
    return (
      <OptionsThemedLayout>
        <div className="mt-8">
        <BackLink href="/create-event">← Back to your events</BackLink>
      </div>  <h1 className="mt-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Event options
        </h1>
        <p className="mt-2 text-sm text-white/65">
          Select an event to manage its options (poll choices).
        </p>
        <div className="mt-8 rounded-3xl border border-white/15 bg-[#0c1234]/35 p-6 backdrop-blur-xl sm:p-8">
          {myEventsLoading ? (
            <p className="text-white/55">Loading your events...</p>
          ) : myEvents.length === 0 ? (
            <p className="text-sm text-white/65">
              You have no events yet.{" "}
              <Link
                href="/create-event/create-form"
                className="font-medium text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline"
              >
                Create one
              </Link>{" "}
              first.
            </p>
          ) : (
            <ul className="space-y-2">
              {myEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/create-event/create-form/options?event_id=${encodeURIComponent(e.id)}`}
                    className="block rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white transition hover:border-cyan-400/30 hover:bg-white/5"
                  >
                    <span className="font-medium">{e.title}</span>
                    {e.category_name && (
                      <span className="ml-2 text-xs text-white/50">{e.category_name}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </OptionsThemedLayout>
    );
  }

  if (eventLoading || !event) {
    return (
      <OptionsThemedLayout>
         <div className="mt-8">
        <BackLink href="/create-event">← Back to your events</BackLink>
      </div> <div className="mt-8 rounded-3xl border border-white/15 bg-[#0c1234]/35 px-6 py-10 text-center backdrop-blur-xl">
          <p className="text-sm text-white/65">{eventError || "Loading event..."}</p>
        </div>
      </OptionsThemedLayout>
    );
  }

  return (
    <OptionsThemedLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="">
        <BackLink href="/create-event">← Back to your events</BackLink>
      </div>  <Link
          href={`/create-event/edit/${encodeURIComponent(event.id)}`}
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-400/35 hover:bg-white/10 hover:text-cyan-100"
        >
          Edit event details
        </Link>
      </div>

      <h1 className="mt-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
        {event.title}
      </h1>
      <p className="mt-2 text-sm text-white/65">Manage poll options for this event.</p>

      <section className="mt-8 rounded-3xl border border-white/15 bg-[#0c1234]/35 p-6 backdrop-blur-xl sm:p-8">
        <h2 className="mb-3 text-sm font-semibold text-white/90">Event description</h2>
        <div
          className="ql-editor prose prose-invert min-h-[60px] max-w-none rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/80"
          dangerouslySetInnerHTML={{
            __html: event.description || "<p class='text-white/45'>No description.</p>",
          }}
        />
      </section>

      <section className="mt-6 rounded-3xl border border-white/15 bg-[#101742]/40 p-6 backdrop-blur-xl sm:p-8">
        <h2 className="mb-5 text-lg font-semibold text-white">Options (poll choices)</h2>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70" htmlFor="opt-name">
              Option name
            </label>
            <input
              id="opt-name"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Yes / No / Undecided"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/45"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70">
              Description (optional)
            </label>
            <RichTextEditor
              value={formDescription}
              onChange={setFormDescription}
              placeholder="Optional description for this option..."
            />
          </div>
          {submitError && <p className="text-sm text-red-300">{submitError}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitLoading}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitLoading ? "Saving..." : editingId ? "Update option" : "Add option"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {optionsLoading ? (
          <p className="text-sm text-white/55">Loading options...</p>
        ) : optionsError ? (
          <p className="text-sm text-red-300">{optionsError}</p>
        ) : options.length === 0 ? (
          <p className="text-sm text-white/50">No options yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {options.map((opt) => (
              <li
                key={opt.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-white/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{opt.name}</p>
                  {opt.description && (
                    <div
                      className="ql-editor prose prose-invert mt-1 max-w-none text-sm text-white/60 [&_p]:my-0.5"
                      dangerouslySetInnerHTML={{ __html: opt.description }}
                    />
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(opt)}
                    className="rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(opt.id)}
                    className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

     
    </OptionsThemedLayout>
  );
}
