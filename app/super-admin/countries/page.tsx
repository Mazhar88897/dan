"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CountryRow = {
  id: string;
  name: string;
  code?: string;
};

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "") || "http://localhost:3000";
}

function parseCountriesPayload(data: unknown): CountryRow[] {
  const raw = Array.isArray(data) ? data : (data as { data?: unknown }).data;
  if (!Array.isArray(raw)) return [];
  const out: CountryRow[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const o = c as Record<string, unknown>;
    const idRaw = o.id ?? o.country_id ?? o.iso2 ?? o.iso_code ?? o.code;
    const id = idRaw != null && String(idRaw).trim() !== "" ? String(idRaw).trim() : "";
    const nameRaw = o.name ?? o.country_name ?? o.title ?? o.label;
    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
    const codeRaw = o.code ?? o.iso2 ?? o.iso_code;
    const code = codeRaw != null && String(codeRaw).trim() !== "" ? String(codeRaw).trim() : "";
    if (id && name) out.push({ id, name, code: code || undefined });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  if (data && typeof data === "object" && "error" in data) {
    const e = (data as { error: unknown }).error;
    if (typeof e === "string" && e.trim()) return e;
  }
  return fallback;
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

export default function SuperAdminCountriesPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createName, setCreateName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<CountryRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editIsoCode, setEditIsoCode] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteRow, setDeleteRow] = useState<CountryRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const getAuth = () =>
    typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;

  const loadCountries = useCallback(async () => {
    const auth = getAuth();
    if (!auth) {
      setLoading(false);
      router.replace("/super-admin/auth");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase()}/api/countries`, {
        headers: { Authorization: auth },
      });
      if (!res.ok) {
        const body: unknown = await res.json().catch(() => ({}));
        throw new Error(getErrorMessage(body, `Failed to load countries (${res.status})`));
      }
      const data: unknown = await res.json();
      setCountries(parseCountriesPayload(data));
    } catch (e) {
      setCountries([]);
      setError(e instanceof Error ? e.message : "Failed to load countries");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadCountries();
  }, [loadCountries]);

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return countries;
    return countries.filter((c) =>
      `${c.id} ${c.name} ${c.code ?? ""}`.toLowerCase().includes(term),
    );
  }, [countries, search]);

  const handleCreate = async () => {
    const auth = getAuth();
    const name = createName.trim();
    if (!name) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await fetch(`${apiBase()}/api/countries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify({ name }),
      });
      const body: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(getErrorMessage(body, `Create failed (${res.status})`));
      }
      setCreateName("");
      await loadCountries();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (row: CountryRow) => {
    setEditRow(row);
    setEditName(row.name);
    setEditIsoCode((row.code ?? "").toUpperCase());
    setEditError(null);
  };

  const handleEdit = async () => {
    if (!editRow) return;
    const auth = getAuth();
    const name = editName.trim();
    const isoCode = editIsoCode.trim().toUpperCase();
    if (!name || !isoCode) {
      setEditError("Name and ISO code are required.");
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`${apiBase()}/api/countries/${encodeURIComponent(editRow.id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify({ name, iso_code: isoCode, code: isoCode }),
      });
      const body: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(getErrorMessage(body, `Update failed (${res.status})`));
      }
      setEditRow(null);
      await loadCountries();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRow) return;
    const auth = getAuth();
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${apiBase()}/api/countries/${encodeURIComponent(deleteRow.id)}`, {
        method: "DELETE",
        headers: {
          ...(auth ? { Authorization: auth } : {}),
        },
      });
      const body: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(getErrorMessage(body, `Delete failed (${res.status})`));
      }
      setDeleteRow(null);
      await loadCountries();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
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
            <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
              Countries
            </h1>
            <p className="mt-1 text-sm text-white/55">Manage countries via <code>/api/countries</code>.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/super-admin/crud"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white"
            >
              Events
            </Link>
            <Link
              href="/super-admin/users"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white"
            >
              Users
            </Link>
            <button
              type="button"
              onClick={() => void loadCountries()}
              disabled={loading}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:text-white/90"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-white/50">Create country</span>
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Country name"
              className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </label>
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={createLoading || !createName.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-purple-500 disabled:opacity-50"
          >
            {createLoading ? "Creating…" : "Add country"}
          </button>
          {createError && (
            <p className="text-sm text-amber-200 sm:col-span-2">{createError}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country id, name, code…"
            disabled={loading}
            className="w-full max-w-md rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            {error}
          </p>
        )}

        {loading ? (
          <div className="py-20 text-center text-white/55">Loading countries…</div>
        ) : filteredCountries.length === 0 ? (
          <div className="py-20 text-center text-sm text-white/55">No countries to show.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
                    <th className="w-14 px-3 py-3 text-center font-medium">Sr no.</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Country ID</th>
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="w-14 px-4 py-3 text-right font-medium">Edit</th>
                    <th className="w-14 px-4 py-3 text-right font-medium">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCountries.map((c, index) => (
                    <tr key={c.id} className="text-white/85 transition hover:bg-white/[0.04]">
                      <td className="px-3 py-3 text-center tabular-nums text-white/55">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/55">{c.id}</td>
                      <td className="px-4 py-3 text-white/65">{c.code ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/90 transition hover:bg-white/10"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteRow(c)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-red-300/90 transition hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
                          title="Delete country"
                          aria-label="Delete country"
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
          {countries.length} countr{countries.length === 1 ? "y" : "ies"}
          {search.trim() ? ` · ${filteredCountries.length} match search` : ""}
        </p>
      </div>

      {editRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1234]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Edit country</h2>
            <p className="mt-1 text-xs text-white/45 font-mono">{editRow.id}</p>
            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">Name</span>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-white/50">ISO code</span>
              <input
                type="text"
                value={editIsoCode}
                onChange={(e) => setEditIsoCode(e.target.value.toUpperCase())}
                placeholder="e.g. GB"
                maxLength={8}
                className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
            {editError && <p className="mt-3 text-sm text-red-300">{editError}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={editLoading}
                onClick={() => setEditRow(null)}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={editLoading}
                onClick={() => void handleEdit()}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-purple-500 disabled:opacity-50"
              >
                {editLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteRow && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1234]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Delete country?</h2>
            <p className="mt-2 text-sm text-white/65">
              This cannot be undone. <span className="font-medium text-white/90">{deleteRow.name}</span>
            </p>
            {deleteError && <p className="mt-3 text-sm text-red-300">{deleteError}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setDeleteRow(null);
                  setDeleteError(null);
                }}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => void handleDelete()}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1234]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Log out?</h2>
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
