/** Tolerant country list parse (aligns with super-admin users page). */
export function parseCountriesPayload(data: unknown): { id: string; name: string }[] {
  const raw = Array.isArray(data) ? data : (data as { data?: unknown })?.data;
  if (!Array.isArray(raw)) return [];
  const out: { id: string; name: string }[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const o = c as Record<string, unknown>;
    const idRaw = o.id ?? o.country_id ?? o.iso2 ?? o.iso_code ?? o.code;
    const id = idRaw != null && String(idRaw).trim() !== "" ? String(idRaw).trim() : "";
    const nameRaw = o.name ?? o.country_name ?? o.title ?? o.label;
    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
    if (id && name) out.push({ id, name });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}
