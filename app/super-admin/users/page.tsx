"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserRow = {
  id: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  verification_status?: string;
  country_id?: string;
  created_at?: string;
};

type CountryRow = { id: string; name: string };

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "") || "http://localhost:3000";
}

function parseUsersPayload(data: unknown): UserRow[] {
  const raw = Array.isArray(data) ? data : (data as { data?: unknown }).data;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (u): u is UserRow =>
      u !== null &&
      typeof u === "object" &&
      typeof (u as UserRow).id === "string",
  );
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
    if (id && name) out.push({ id, name });
  }
  return out;
}

function displayName(u: UserRow): string {
  if (u.name?.trim()) return u.name.trim();
  const first = u.first_name?.trim() ?? "";
  const last = u.last_name?.trim() ?? "";
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  return u.email?.trim() || u.id;
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

export default function SuperAdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; label: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    const auth =
      typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;
    if (!auth) {
      setLoading(false);
      router.replace("/super-admin/auth");
      return;
    }

    setLoading(true);
    setError(null);
    setCountriesError(null);

    const headers = { Authorization: auth };

    try {
      const [usersRes, countriesRes] = await Promise.all([
        fetch(`${apiBase()}/api/users`, { headers }),
        fetch(`${apiBase()}/api/countries`, { headers }),
      ]);

      if (!usersRes.ok) {
        throw new Error(`Failed to load users: ${usersRes.status}`);
      }
      const usersJson: unknown = await usersRes.json();
      setUsers(parseUsersPayload(usersJson));

      if (countriesRes.ok) {
        const countriesJson: unknown = await countriesRes.json();
        setCountries(parseCountriesPayload(countriesJson));
      } else {
        setCountries([]);
        setCountriesError(`Countries: ${countriesRes.status}`);
      }
    } catch (e) {
      setUsers([]);
      setCountries([]);
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const countryNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of countries) {
      m.set(c.id, c.name);
    }
    return m;
  }, [countries]);

  const resolveCountryName = useCallback(
    (countryId: string | undefined) => {
      const id = (countryId ?? "").trim();
      if (!id) return "";
      return countryNameById.get(id) ?? "";
    },
    [countryNameById],
  );

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => {
      const countryName = resolveCountryName(u.country_id);
      const blob = [
        u.id,
        u.email,
        u.name,
        u.first_name,
        u.last_name,
        u.verification_status,
        u.country_id,
        countryName,
        u.created_at,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(term);
    });
  }, [users, search, resolveCountryName]);

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const auth =
      typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      const url = `${apiBase()}/api/users/${encodeURIComponent(confirmDelete.id)}`;
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
      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id));
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
              Users
            </h1>
            {/* <p className="mt-1 text-sm text-white/55">
              <code className="text-white/40">GET /api/users</code> — delete only.
            </p> */}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/super-admin/crud"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white"
            >
              Events
            </Link>
            <Link
              href="/super-admin/countries"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white"
            >
              Countries
            </Link>
            <button
              type="button"
              onClick={() => void loadUsers()}
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

        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search id, email, name, country, status…"
            disabled={loading}
            className="w-full max-w-md rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            {error}
          </p>
        )}
        {countriesError && !error && (
          <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            {countriesError} — country names may be missing.
          </p>
        )}

        {loading ? (
          <div className="py-20 text-center text-white/55">Loading users and countries…</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-sm text-white/55">No users to show.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
                    <th className="w-14 px-3 py-3 text-center font-medium">Sr no.</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Kyc Status</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="w-14 px-4 py-3 text-right font-medium">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u, index) => (
                    <tr key={u.id} className="text-white/85 transition hover:bg-white/[0.04]">
                      <td className="px-3 py-3 text-center tabular-nums text-white/55">{index + 1}</td>
                      <td className="max-w-[200px] px-4 py-3">
                        <span className="font-medium text-white">{displayName(u)}</span>
                        <p className="mt-0.5 font-mono text-[10px] text-white/35">{u.id}</p>
                      </td>
                      <td className="px-4 py-3 text-white/70">{u.email ?? "—"}</td>
                      <td className="px-4 py-3">
                        {u.verification_status ? (
                          <span className="inline-block rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2 py-0.5 text-xs capitalize text-emerald-200">
                            {u.verification_status}
                          </span>
                        ) : (
                          <span className="text-white/35">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {resolveCountryName(u.country_id) ||
                          ((u.country_id ?? "").trim() ? "Unknown" : "—")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-white/60">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmDelete({ id: u.id, label: displayName(u) })
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-red-300/90 transition hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
                          title="Delete user"
                          aria-label="Delete user"
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
          {users.length} user{users.length === 1 ? "" : "s"}
          {search.trim() ? ` · ${filteredUsers.length} match search` : ""}
        </p>
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1234]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h2 id="delete-user-title" className="text-lg font-semibold text-white">
              Delete user?
            </h2>
            <p className="mt-2 text-sm text-white/65">
              This cannot be undone.{" "}
              <span className="font-medium text-white/90">&quot;{confirmDelete.label}&quot;</span>
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
          aria-labelledby="logout-user-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1234]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h2 id="logout-user-dialog-title" className="text-lg font-semibold text-white">
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
