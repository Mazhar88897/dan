"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import ReactCountryFlag from "react-country-flag";

function apiOrigin(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return base || (typeof window !== "undefined" ? window.location.origin : "");
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatCountdownParts(ms: number) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { d, h, m, s };
}

function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function normalizeHtmlText(html: string): string {
  if (!html) return "<p>No description.</p>";
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00A0/g, " ")
    .replace(/ {2,}/g, " ");
}

const DONUT_COLORS = [
  "#a78bfa",
  "#c084fc",
  "#e879f9",
  "#8b5cf6",
  "#a855f7",
  "#6366f1",
  "#d946ef",
  "#7c3aed",
] as const;

function annularSectorPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number,
) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const a0 = rad(startDeg);
  const a1 = rad(endDeg);
  const x0 = cx + rOuter * Math.cos(a0);
  const y0 = cy + rOuter * Math.sin(a0);
  const x1 = cx + rOuter * Math.cos(a1);
  const y1 = cy + rOuter * Math.sin(a1);
  const x2 = cx + rInner * Math.cos(a1);
  const y2 = cy + rInner * Math.sin(a1);
  const x3 = cx + rInner * Math.cos(a0);
  const y3 = cy + rInner * Math.sin(a0);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return [
    `M ${x0} ${y0}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x3} ${y3}`,
    "Z",
  ].join(" ");
}

function shortenLabel(s: string, max = 14) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

type CountryVoteDonutSegment = {
  name: string;
  votes: number;
  pct: number;
  flagIso?: string | null;
};

function CountryVotesDonut({
  centerTotal,
  segments,
  showLegend = true,
}: {
  centerTotal: number;
  segments: CountryVoteDonutSegment[];
  showLegend?: boolean;
}) {
  const cx = 100;
  const cy = 100;
  const rOuter = 78;
  const rInner = 48;
  const labelR = 92;

  let angle = -90;
  const uid = useId().replace(/:/g, "");
  const filterId = `donutGlow-${uid}`;

  const slicePaths = segments.map((seg, i) => {
    const sweep = seg.pct > 0 ? (seg.pct / 100) * 360 : 0;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    const d =
      sweep > 0.05
        ? annularSectorPath(cx, cy, rInner, rOuter, start, end)
        : "";
    const mid = (start + end) / 2;
    const mr = (mid * Math.PI) / 180;
    const lx = cx + labelR * Math.cos(mr);
    const ly = cy + labelR * Math.sin(mr);
    const color = DONUT_COLORS[i % DONUT_COLORS.length];
    const flagIso = seg.flagIso ?? null;
    return { d, mid, lx, ly, seg, color, i, sweep, flagIso };
  });

  return (
    <div
      className={
        showLegend
          ? "flex flex-col items-center gap-6 sm:gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
          : "flex items-center justify-center"
      }
    >
      <div className="relative w-full max-w-[min(100%,min(90vw,340px))] shrink-0 sm:max-w-[400px] md:max-w-[min(100%,440px)]">
        <svg
          width={400}
          height={400}
          viewBox="0 0 200 200"
          className="h-auto w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={(rOuter + rInner) / 2}
            fill="none"
            stroke="rgba(139,92,246,0.25)"
            strokeWidth={rOuter - rInner}
            className="opacity-90"
          />
          {slicePaths.map(({ d, seg, color, i, sweep }) =>
            d ? (
              <path
                key={`${seg.name}-${i}`}
                d={d}
                fill={color}
                fillOpacity={0.92}
                filter={`url(#${filterId})`}
                className="transition-opacity hover:opacity-100"
              />
            ) : null,
          )}
          {slicePaths.map(({ lx, ly, seg, sweep, flagIso }, ti) =>
            sweep > 4 ? (
              <g key={`t-${seg.name}-${ti}`} className="pointer-events-none select-none">
                {flagIso ? (
                  <foreignObject
                    x={lx - 14}
                    y={ly - (sweep > 10 ? 26 : 22)}
                    width={28}
                    height={20}
                    className="overflow-visible"
                  >
                    <div className="flex h-full w-full items-start justify-center">
                      <ReactCountryFlag
                        countryCode={flagIso}
                        svg
                        style={{
                          width: 26,
                          height: 18,
                          borderRadius: 3,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.6)",
                        }}
                        title={seg.name}
                      />
                    </div>
                  </foreignObject>
                ) : null}
                <text
                  x={lx}
                  y={flagIso ? ly + 6 : ly}
                  fill="white"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline={flagIso ? "hanging" : "middle"}
                  className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
                >
                  <tspan x={lx} dy={flagIso ? "0" : "-0.4em"}>
                    {shortenLabel(seg.name, 15)}
                  </tspan>
                  <tspan x={lx} dy="1.3em" fill="rgba(255,255,255,0.85)" fontSize="6">
                    {seg.pct.toFixed(0)}%
                  </tspan>
                </text>
              </g>
            ) : null,
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {formatInt(centerTotal)}
          </p>
          <p className="mt-1 max-w-[10rem] px-1 text-[10px] font-medium leading-tight text-white/70 sm:mt-2 sm:text-sm">
            Total Global Votes
          </p>
        </div>
      </div>

      {showLegend ? (
        <ul className="w-full max-w-md space-y-2 text-xs sm:space-y-3 sm:text-sm md:text-base lg:max-w-sm">
          {segments.map((seg, i) => (
            <li
              key={`${seg.name}-${i}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                {seg.flagIso ? (
                  <ReactCountryFlag
                    countryCode={seg.flagIso}
                    svg
                    style={{
                      width: "1.5em",
                      height: "1.5em",
                      borderRadius: "4px",
                      boxShadow: "0 0 10px rgba(167,139,250,0.3)",
                    }}
                    title={seg.name}
                  />
                ) : (
                  <span
                    className="flex h-[1.5em] w-[1.5em] shrink-0 items-center justify-center rounded bg-white/10 text-base leading-none text-white/60"
                    title="Unknown region"
                    aria-hidden
                  >
                    🌐
                  </span>
                )}
                <span
                  className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_currentColor]"
                  style={{
                    backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length],
                    color: DONUT_COLORS[i % DONUT_COLORS.length],
                  }}
                  aria-hidden
                />
                <span className="truncate font-medium text-white/90">{seg.name}</span>
              </span>
              <span className="shrink-0 tabular-nums text-white/60">
                {formatInt(seg.votes)}{" "}
                <span className="text-white/40">({seg.pct.toFixed(0)}%)</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type EventDetailOption = {
  id: string;
  event_id: string;
  name: string;
  description: string;
  votes_count: number;
};

type EventDetail = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  is_public: boolean;
  category_name?: string;
  start_date: string;
  end_date: string;
  status?: string;
  options: EventDetailOption[];
  total_votes_cast: number;
  country_participated_total: number;
  avg_age: number;
};

type CountryOptionRow = {
  option_id: string;
  option_name: string;
  votes_count: number;
};

type ByCountryRow = {
  country_id: string;
  country_name: string;
  options: CountryOptionRow[];
};

/** Response shape from GET /api/events/hero */
type HeroEventSummary = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  category_name?: string;
  status?: string;
  start_date: string;
  end_date: string;
};

const RESULT_TABS = ["Global Results", "By Country", "By Age"] as const;
type ResultTab = (typeof RESULT_TABS)[number];

const OPTION_STYLES = [
  {
    colorClass: "bg-gradient-to-r from-blue-600 to-blue-400",
    glowClass: "shadow-[0_0_16px_rgba(59,130,246,0.45)]",
  },
  {
    colorClass: "bg-gradient-to-r from-red-600 to-red-400",
    glowClass: "shadow-[0_0_16px_rgba(239,68,68,0.45)]",
  },
  {
    colorClass: "bg-gradient-to-r from-amber-600 to-amber-400",
    glowClass: "shadow-[0_0_16px_rgba(245,158,11,0.4)]",
  },
  {
    colorClass: "bg-gradient-to-r from-emerald-600 to-emerald-400",
    glowClass: "shadow-[0_0_16px_rgba(16,185,129,0.4)]",
  },
  {
    colorClass: "bg-gradient-to-r from-violet-600 to-violet-400",
    glowClass: "shadow-[0_0_16px_rgba(139,92,246,0.45)]",
  },
  {
    colorClass: "bg-gradient-to-r from-cyan-600 to-cyan-400",
    glowClass: "shadow-[0_0_16px_rgba(6,182,212,0.4)]",
  },
  {
    colorClass: "bg-gradient-to-r from-fuchsia-600 to-fuchsia-400",
    glowClass: "shadow-[0_0_16px_rgba(217,70,239,0.4)]",
  },
  {
    colorClass: "bg-gradient-to-r from-orange-600 to-orange-400",
    glowClass: "shadow-[0_0_16px_rgba(249,115,22,0.4)]",
  },
] as const;

const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  Global: "",
  "United States": "US",
  "United States of America": "US",
  "United States Of America": "US",
  USA: "US",
  "U.S.A.": "US",
  "U.S.": "US",
  China: "CN",
  Germany: "DE",
  Canada: "CA",
  France: "FR",
  Japan: "JP",
  India: "IN",
  Brazil: "BR",
  Russia: "RU",
  "Russian Federation": "RU",
  "United Kingdom": "GB",
  UK: "GB",
  Australia: "AU",
};

function countryFlagCode(countryId: string, countryName: string): string | null {
  if (countryId === "global" || /^global$/i.test(countryName)) return null;

  const idNorm = countryId.trim().toUpperCase();
  if (idNorm === "US" || idNorm === "USA") return "US";

  const trimmed = countryName.trim();
  const mapped = COUNTRY_NAME_TO_ISO[trimmed];
  if (mapped !== undefined) return mapped || null;

  const lower = trimmed.toLowerCase();
  if (lower === "usa" || lower === "u.s.a." || lower === "u.s.") return "US";
  if (lower.includes("united states")) return "US";

  return null;
}

function orderCountryOptionsByEvent(
  rows: CountryOptionRow[],
  eventOptions: EventDetailOption[],
): CountryOptionRow[] {
  const map = new Map(rows.map((r) => [r.option_id, r]));
  return eventOptions.map((eo) => {
    const found = map.get(eo.id);
    return (
      found ?? {
        option_id: eo.id,
        option_name: eo.name,
        votes_count: 0,
      }
    );
  });
}

function yesNoUndecidedRank(name: string): number | null {
  const n = name.trim().toLowerCase();
  if (n === "yes" || n === "y") return 0;
  if (n === "no" || n === "n") return 1;
  if (
    n === "undecided" ||
    n === "abstain" ||
    n === "maybe" ||
    n === "not sure" ||
    n === "unsure" ||
    n === "neutral"
  ) {
    return 2;
  }
  return null;
}

/** If Yes, No, and an undecided-type option are all present, order them Yes → No → Undecided, then any other options. */
function sortOptionsYesNoUndecidedFirst<T extends { name: string }>(items: T[]): T[] {
  if (items.length < 3) return items;
  const ranked = items.filter((i) => yesNoUndecidedRank(i.name) !== null);
  const hasYes = ranked.some((i) => yesNoUndecidedRank(i.name) === 0);
  const hasNo = ranked.some((i) => yesNoUndecidedRank(i.name) === 1);
  const hasUndecided = ranked.some((i) => yesNoUndecidedRank(i.name) === 2);
  if (!(hasYes && hasNo && hasUndecided)) return items;
  const unranked = items.filter((i) => yesNoUndecidedRank(i.name) === null);
  ranked.sort((a, b) => (yesNoUndecidedRank(a.name) as number) - (yesNoUndecidedRank(b.name) as number));
  return [...ranked, ...unranked];
}

function PieChartIcon({ size = 28 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const idA = `pieA-${uid}`;
  const idB = `pieB-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 12V3a9 9 0 019 9h-9z" fill={`url(#${idA})`} opacity={0.95} />
      <path d="M12 12H3a9 9 0 1018 0h-9z" fill={`url(#${idB})`} opacity={0.85} />
      <defs>
        <linearGradient id={idA} x1="12" y1="3" x2="21" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id={idB} x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#38bdf8" strokeWidth="1.2" fill="rgba(56,189,248,0.15)" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#7dd3fc" strokeWidth="1" fill="none" />
      <path d="M3 12h18" stroke="#7dd3fc" strokeWidth="1" />
      <path d="M12 3c2 2.5 3 5.5 3 9s-1 6.5-3 9" stroke="#38bdf8" strokeWidth="0.8" fill="none" />
      <path d="M12 3c-2 2.5-3 5.5-3 9s1 6.5 3 9" stroke="#38bdf8" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M3 9h18" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M8 3v4M16 3v4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="12" width="3" height="2.5" rx="0.5" fill="#60a5fa" opacity={0.9} />
      <rect x="11.5" y="12" width="3" height="2.5" rx="0.5" fill="#60a5fa" opacity={0.6} />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 3v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z"
        fill="#14532d"
        stroke="#22c55e"
        strokeWidth="1.2"
      />
      <path d="M9 12l2 2 4-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="18" cy="5" r="2.5" fill="currentColor" />
      <circle cx="6" cy="12" r="2.5" fill="currentColor" />
      <circle cx="18" cy="19" r="2.5" fill="currentColor" />
      <path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 21h6M10 18h4M12 3a5 5 0 015 5c0 2.5-1.5 4-3 5.5V15H10v-1.5C8.5 12 7 10.5 7 8a5 5 0 015-5z"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(251,191,36,0.12)"
      />
    </svg>
  );
}

function GlassPanel({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

const AGE_BUCKET_LABELS = ["<21", "21-35", "35-50", "50-65", "65+"] as const;
const AGE_BUCKET_CENTERS = [18, 28, 42, 57, 72];

/**
 * When the API does not return per-bracket vote counts, approximate bucket totals from
 * `avg_age` and `total_votes_cast` so bars sum to the overall vote count.
 */
function splitVotesAcrossAgeBuckets(meanAge: number, totalVotes: number): number[] {
  const n = AGE_BUCKET_LABELS.length;
  const zeros = () => Array.from({ length: n }, () => 0);
  if (totalVotes <= 0 || !Number.isFinite(meanAge) || meanAge <= 0) return zeros();

  const sigma = 14;
  const raw = AGE_BUCKET_CENTERS.map((c) =>
    Math.exp(-0.5 * ((c - meanAge) / sigma) ** 2),
  );
  const sumW = raw.reduce((a, b) => a + b, 0);
  if (sumW <= 0) {
    const u = Math.floor(totalVotes / n);
    const r = totalVotes % n;
    return AGE_BUCKET_LABELS.map((_, i) => u + (i < r ? 1 : 0));
  }

  const floats = raw.map((w) => (w / sumW) * totalVotes);
  const ints = floats.map((f) => Math.floor(f));
  let rem = totalVotes - ints.reduce((a, b) => a + b, 0);
  const frac = floats.map((f, i) => ({ i, f: f - Math.floor(f) }));
  frac.sort((a, b) => b.f - a.f);
  const out = [...ints];
  for (let k = 0; k < rem; k++) {
    out[frac[k % frac.length].i]++;
  }
  return out;
}

function ResultBar({
  label,
  valueLabel,
  pct,
  colorClass,
  glowClass,
}: {
  label: string;
  valueLabel: string;
  pct: number;
  colorClass: string;
  glowClass: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-2 text-xs sm:text-sm">
        <span className="min-w-0 font-medium text-white/90">{label}</span>
        <span className="shrink-0 tabular-nums text-white/70">{valueLabel}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${colorClass} ${glowClass}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

export default function TestEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId =
    typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [byCountry, setByCountry] = useState<ByCountryRow[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [activeTab, setActiveTab] = useState<ResultTab>("Global Results");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [voteTargetOption, setVoteTargetOption] = useState<EventDetailOption | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [heroEvents, setHeroEvents] = useState<HeroEventSummary[]>([]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!eventId) {
      setLoadState("error");
      setErrorMessage("Missing event id.");
      return;
    }

    const origin = apiOrigin();
    const detailUrl = `${origin}/api/events/event-detail/${eventId}`;
    const countryUrl = `${origin}/api/events/event-detail/by-country/${eventId}`;

    setLoadState("loading");
    setErrorMessage(null);

    Promise.all([
      fetch(detailUrl).then((res) => {
        if (!res.ok) throw new Error(`Event detail failed (${res.status})`);
        return res.json() as Promise<EventDetail>;
      }),
      fetch(countryUrl).then((res) => {
        if (!res.ok) throw new Error(`By-country failed (${res.status})`);
        return res.json() as Promise<ByCountryRow[]>;
      }),
    ])
      .then(([detail, countries]) => {
        setEvent(detail);
        setByCountry(Array.isArray(countries) ? countries : []);
        setLoadState("idle");
        setSelectedOptionIndex(0);
      })
      .catch((err) => {
        setEvent(null);
        setByCountry([]);
        setLoadState("error");
        setErrorMessage(err?.message ?? "Failed to load event");
      });
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    const origin = apiOrigin();
    fetch(`${origin}/api/events/hero`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        setHeroEvents(Array.isArray(data) ? (data as HeroEventSummary[]) : []);
      })
      .catch(() => setHeroEvents([]));
  }, [eventId]);

  const relatedEvents = useMemo(
    () => heroEvents.filter((e) => e.id !== eventId),
    [heroEvents, eventId],
  );

  const endMs = event ? new Date(event.end_date).getTime() : 0;
  const { d, h, m, s } = formatCountdownParts(Math.max(endMs - now, 0));
  const isLive =
    !!event &&
    event.status === "active" &&
    now >= new Date(event.start_date).getTime() &&
    now < endMs;

  const options = useMemo(
    () => sortOptionsYesNoUndecidedFirst(event?.options ?? []),
    [event?.options],
  );
  const totalVotes = event?.total_votes_cast ?? 0;

  const globalBars = useMemo(() => {
    return options.map((opt, i) => {
      const pct = totalVotes > 0 ? (opt.votes_count / totalVotes) * 100 : 0;
      const style = OPTION_STYLES[i % OPTION_STYLES.length];
      return {
        key: opt.id,
        label: opt.name,
        valueLabel: `${formatInt(opt.votes_count)} (${pct.toFixed(pct > 0 && pct < 0.1 ? 1 : 0)}%)`,
        pct,
        ...style,
      };
    });
  }, [options, totalVotes]);

  const selectedOption = options[selectedOptionIndex] ?? options[0];
  const countryRowsForTable = useMemo(() => {
    if (!event) return [];
    return byCountry
      .filter((row) => row.country_id !== "global")
      .map((row) => ({
        ...row,
        ordered: orderCountryOptionsByEvent(row.options, options),
      }));
  }, [byCountry, event, options]);

  const countryVoteDonutSegments = useMemo(() => {
    const rows = byCountry.filter((r) => r.country_id !== "global");
    const withVotes = rows
      .map((row) => ({
        name: row.country_name,
        country_id: row.country_id,
        votes: row.options.reduce((s, o) => s + o.votes_count, 0),
      }))
      .filter((x) => x.votes > 0);
    const sum = withVotes.reduce((s, x) => s + x.votes, 0);
    if (sum <= 0) return [] as CountryVoteDonutSegment[];
    return withVotes.map((x) => ({
      name: x.name,
      votes: x.votes,
      pct: (x.votes / sum) * 100,
      flagIso: countryFlagCode(x.country_id, x.name),
    }));
  }, [byCountry]);

  const countryVoteBarRows = useMemo(() => {
    const rows = byCountry.filter((r) => r.country_id !== "global");
    const withTotals = rows
      .map((row) => ({
        key: row.country_id,
        label: row.country_name,
        votes: row.options.reduce((s, o) => s + o.votes_count, 0),
      }))
      .filter((x) => x.votes > 0)
      .sort((a, b) => b.votes - a.votes);
    const sum = withTotals.reduce((s, x) => s + x.votes, 0);
    if (sum <= 0) return [] as { key: string; label: string; valueLabel: string; pct: number; colorClass: string; glowClass: string }[];
    return withTotals.map((row, i) => {
      const pct = (row.votes / sum) * 100;
      const style = OPTION_STYLES[i % OPTION_STYLES.length];
      return {
        key: row.key,
        label: row.label,
        valueLabel: `${formatInt(row.votes)} (${pct.toFixed(pct > 0 && pct < 0.1 ? 1 : 0)}%)`,
        pct,
        ...style,
      };
    });
  }, [byCountry]);

  const ageVoteBarRows = useMemo(() => {
    const total = event?.total_votes_cast ?? 0;
    const mean = event?.avg_age ?? 0;
    const counts = splitVotesAcrossAgeBuckets(mean, total);
    const denom = total > 0 ? total : 1;
    return AGE_BUCKET_LABELS.map((label, i) => {
      const c = counts[i] ?? 0;
      const pct = total > 0 ? (c / denom) * 100 : 0;
      const style = OPTION_STYLES[i % OPTION_STYLES.length];
      return {
        key: label,
        label,
        valueLabel: `${formatInt(c)} (${pct.toFixed(pct > 0 && pct < 0.1 ? 1 : 0)}%)`,
        pct,
        ...style,
      };
    });
  }, [event?.avg_age, event?.total_votes_cast]);

  const heroDescription = useMemo(() => {
    if (!event) return "";
    const plain = stripHtml(event.description);
    return plain || event.category_name || "";
  }, [event]);

  const handleShare = async () => {
    if (typeof window === "undefined" || !eventId) return;
    const url = `${window.location.origin}/events/test/${eventId}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: event?.title, url });
        toast.success("Link shared!");
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const checkAuthStatus = () => {
    if (typeof window === "undefined") return { hasToken: false, isVerified: false };
    const token = window.sessionStorage.getItem("Authorization");
    const verificationStatus = window.sessionStorage.getItem("VerificationStatus");
    return {
      hasToken: !!token,
      isVerified: verificationStatus === "verified",
    };
  };

  const handleOptionVoteClick = (opt: EventDetailOption) => {
    const idx = options.findIndex((o) => o.id === opt.id);
    if (idx >= 0) setSelectedOptionIndex(idx);
    setVoteTargetOption(opt);
    const { hasToken, isVerified } = checkAuthStatus();

    if (!hasToken) {
      setShowLoginModal(true);
      return;
    }

    if (!isVerified) {
      setShowKycModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleVoteSubmit = async () => {
    if (!voteTargetOption || !eventId) return;

    try {
      setVoteError(null);
      setVoteLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const url = `${baseUrl || "http://localhost:3000"}/api/votes`;
      const auth =
        typeof window !== "undefined" ? window.sessionStorage.getItem("Authorization") : null;
      const userId = typeof window !== "undefined" ? window.sessionStorage.getItem("UserId") : null;
      const countryId =
        typeof window !== "undefined" ? window.sessionStorage.getItem("CountryId") : null;

      if (!auth) throw new Error("Not authenticated");
      if (!userId) throw new Error("User ID missing from session");
      if (!countryId) throw new Error("Country ID missing from session — sign in again so your profile country is saved.");

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          user_id: userId,
          event_id: eventId,
          option_id: voteTargetOption.id,
          country_id: countryId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = String((errData as { message?: string }).message ?? "");

        if (message.toLowerCase().includes("already") && message.toLowerCase().includes("vote")) {
          toast("You have already voted for this event. Redirecting to results…", {
            icon: "ℹ️",
            duration: 2000,
          });
          setShowConfirmModal(false);
          setTimeout(() => {
            router.push(`/results/${eventId}`);
          }, 2000);
          return;
        }

        throw new Error(message || `Vote failed: ${res.status}`);
      }

      toast.success("Vote submitted successfully! Redirecting…", { duration: 2000 });
      setShowConfirmModal(false);
      setTimeout(() => {
        router.push("/test");
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit vote";
      setVoteError(msg);
      toast.error(msg);
    } finally {
      setVoteLoading(false);
    }
  };

  if (loadState === "loading" || (loadState === "idle" && !event && !errorMessage)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050515] font-sans text-white">
        <p className="text-white/60">Loading event…</p>
      </div>
    );
  }

  if (loadState === "error" || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050515] px-6 font-sans text-white">
        <p className="text-center text-white/80">{errorMessage ?? "Could not load this event."}</p>
        <Link
          href="/events"
          className="rounded-xl border border-white/20 px-5 py-2.5 text-sm text-white/90 hover:bg-white/10"
        >
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050515] font-sans text-white antialiased">
      <Toaster position="top-center" />
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-5 sm:pb-24 sm:pt-8 md:px-8 lg:px-10">
        {/* Hero */}
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_minmax(280px,1.1fr)] lg:gap-6">
          <div className="order-2 flex flex-col gap-4 sm:gap-6 lg:order-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-1 text-xs text-white/75 sm:text-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
              <span className="text-white/70">Ends in</span>
              <span className="tabular-nums tracking-wide text-white">
                {pad2(d)}:{pad2(h)}:{pad2(m)}:{pad2(s)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl sm:leading-tight md:text-5xl lg:text-[2.75rem] lg:leading-tight">
                {event.title}
              </h1>
              {heroDescription ? (
                <p className="mt-2 max-w-xl text-sm text-white/65 sm:mt-3 sm:text-base md:text-lg">{heroDescription}</p>
              ) : null}
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              <button
                type="button"
                disabled={options.length === 0}
                onClick={() => {
                  document.getElementById("vote")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(59,130,246,0.4)] transition hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
              >
                Vote Now
              </button>
              <button
                type="button"
                onClick={() => void handleShare()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/10 sm:w-auto"
              >
                <ShareIcon />
                Share Event
              </button>
            </div>
          </div>

          <div className="hidden sm:block relative order-1 flex min-h-[200px] justify-center sm:min-h-[280px] lg:order-2 lg:min-h-[420px]">
            <div
              className="pointer-events-none absolute right-0 top-1/2 h-[min(85vw,420px)] w-[min(85vw,420px)] -translate-y-1/2 translate-x-[8%] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.35)_0%,rgba(251,146,60,0.12)_35%,transparent_65%)] blur-2xl sm:h-[min(90vw,520px)] sm:w-[min(90vw,520px)] sm:translate-x-[15%]"
              aria-hidden
            />
            <div className="relative aspect-square w-full max-w-[min(100%,min(92vw,380px))] pt-6 sm:max-w-[min(100%,520px)] sm:pt-16">
              {countryVoteDonutSegments.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <GlobeIcon />
                </div>
              ) : (
                <CountryVotesDonut
                  centerTotal={event.total_votes_cast}
                  segments={countryVoteDonutSegments}
                  showLegend={false}
                />
              )}
            </div>
          </div>
        </div>


        <section className="mt-10 sm:mt-14 lg:mt-16">
          <GlassPanel className="overflow-hidden border-white/15 bg-[#0c1234]/35 px-4 py-6 sm:px-8 sm:py-10">
            <h2 className="mb-4 text-center text-base font-semibold text-white sm:mb-6 sm:text-lg md:text-xl">
              Country vote distribution
            </h2>
            {countryVoteDonutSegments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <GlobeIcon />
                <p className="max-w-md text-sm text-white/55">
                  No country-level votes yet. This chart fills as votes are recorded per country.
                </p>
              </div>
            ) : (
              <CountryVotesDonut centerTotal={event.total_votes_cast} segments={countryVoteDonutSegments} />
            )}
          </GlassPanel>
        </section>

        {/* Event Insights */}
        <section className="mt-10 sm:mt-16 lg:mt-20">
          <h2 className="mb-3 text-base font-semibold text-white sm:mb-5 sm:text-lg">Event Insights</h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-4">
            <InsightCard icon={<PieChartIcon />} value={formatInt(event.total_votes_cast)} label="Total Votes" />
            <InsightCard
              icon={<GlobeIcon />}
              value={formatInt(event.country_participated_total)}
              label="Countries participated"
            />
            <InsightCard
              icon={<CalendarIcon />}
              value={Number.isFinite(event.avg_age) ? String(event.avg_age) : "—"}
              label="Avg Age"
            />
            <InsightCard
              icon={<ShieldCheckIcon />}
              value={event.is_public ? "Public" : "Private"}
              label="Visibility"
            />
          </div>
        </section>

        {/* Detailed results */}
        <section className="mt-10 sm:mt-14 lg:mt-16">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-white sm:mb-4 sm:text-2xl md:text-3xl">
            Detailed Poll Results
          </h2>
          <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[#11173a]/40 p-2 pb-1 pt-0.5 sm:mx-0 sm:mb-6 sm:flex-wrap sm:gap-2 sm:overflow-visible">
            {RESULT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                  activeTab === tab
                    ? "bg-[#3a52b8] text-white shadow-[0_0_20px_rgba(80,120,255,0.35)]"
                    : "text-white/65 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[1.15fr_1fr]">
            <GlassPanel className="min-w-0 overflow-hidden p-4 sm:p-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                <Image
                  src="/src2.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              <div className="mt-4 space-y-4">
                {activeTab === "Global Results" ? (
                  globalBars.length === 0 ? (
                    <p className="text-sm text-white/50">No voting options configured.</p>
                  ) : (
                    globalBars.map((bar) => (
                      <ResultBar
                        key={bar.key}
                        label={bar.label}
                        valueLabel={bar.valueLabel}
                        pct={bar.pct}
                        colorClass={bar.colorClass}
                        glowClass={bar.glowClass}
                      />
                    ))
                  )
                ) : activeTab === "By Country" ? (
                  countryVoteBarRows.length === 0 ? (
                    <p className="text-sm text-white/50">No country-level votes yet.</p>
                  ) : (
                    countryVoteBarRows.map((bar) => (
                      <ResultBar
                        key={bar.key}
                        label={bar.label}
                        valueLabel={bar.valueLabel}
                        pct={bar.pct}
                        colorClass={bar.colorClass}
                        glowClass={bar.glowClass}
                      />
                    ))
                  )
                ) : (
                  <>
                    {totalVotes <= 0 || !Number.isFinite(event.avg_age) || event.avg_age <= 0 ? (
                      <p className="text-sm text-white/50">
                        Age breakdown appears once there are votes and a valid average age.
                      </p>
                    ) : (
                      ageVoteBarRows.map((bar) => (
                        <ResultBar
                          key={bar.key}
                          label={bar.label}
                          valueLabel={bar.valueLabel}
                          pct={bar.pct}
                          colorClass={bar.colorClass}
                          glowClass={bar.glowClass}
                        />
                      ))
                    )}
                    {totalVotes > 0 && Number.isFinite(event.avg_age) && event.avg_age > 0 ? (
                      <p className="pt-1 text-[11px] leading-snug text-white/40">
                        Bracket counts are estimated from average age and total votes until per-age
                        counts are available from the API.
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            </GlassPanel>

            <GlassPanel className="flex min-w-0 max-w-full flex-col border-white/15 bg-[#101742]/45 p-4 sm:p-6">
              <h3 className="mb-3 text-lg font-semibold tracking-tight text-white sm:mb-4 sm:text-2xl md:text-3xl">
                Options Description:
              </h3>
              {/* <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-2">
                <button
                  type="button"
                  onClick={() => setPerspectiveSide("yes")}
                  className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    perspectiveSide === "yes"
                      ? "bg-[#3a52b8] text-white shadow-[0_0_12px_rgba(80,120,255,0.35)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  Why YES?
                </button>
                <button
                  type="button"
                  onClick={() => setPerspectiveSide("no")}
                  className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    perspectiveSide === "no"
                      ? "bg-[#3a52b8] text-white shadow-[0_0_12px_rgba(80,120,255,0.35)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  Why NO?
                </button>
              </div> */}
              <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-2">
                <div className="flex flex-wrap gap-2">
                  {options.map((opt, i) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionIndex(i)}
                      title={`Why ${opt.name}?`}
                      className={`max-w-[calc(50%-0.25rem)] flex-1 basis-[calc(50%-0.25rem)] rounded-lg px-2 py-2 text-center text-[10px] font-semibold leading-tight transition sm:max-w-none sm:flex-none sm:basis-auto sm:whitespace-nowrap sm:px-3 sm:text-left sm:text-sm ${
                        selectedOptionIndex === i
                          ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.35)]"
                          : "text-white/55 hover:bg-white/5 hover:text-white/85"
                      }`}
                    >
                      <span className="line-clamp-2 sm:line-clamp-none">Why {opt.name}?</span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedOption ? (
                <div className="min-w-0 max-w-full flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
                  <p className="mb-2 truncate text-sm font-semibold text-white/90 sm:mb-3 sm:whitespace-normal">
                    {selectedOption.name}
                  </p>
                  <div
                    className="max-h-48 max-w-full overflow-x-hidden overflow-y-auto pr-1 text-[11px] leading-relaxed text-white/70 break-words whitespace-normal [overflow-wrap:anywhere] sm:max-h-56 sm:text-xs [&_a]:break-all [&_a]:text-blue-400 [&_img]:max-h-24 [&_img]:max-w-full [&_img]:object-contain [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 [&_p]:whitespace-normal [&_p]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:max-w-full [&_table]:table-fixed [&_table]:text-[10px] [&_ul]:list-disc [&_ul]:pl-4"
                    dangerouslySetInnerHTML={{
                      __html: normalizeHtmlText(selectedOption.description),
                    }}
                  />
                </div>
              ) : (
                <p className="text-sm text-white/50">Select an option to read its perspective.</p>
              )}
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#2a2044]/40 px-4 py-3">
                <LightbulbIcon />
                <div>
                  <p className="text-sm font-semibold text-amber-200/95">Choose Your Option</p>
                  <p className="mt-1 text-xs text-white/55">
                    Use the tabs above to read each option. Cast your vote in the section below.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* Vote CTA */}
        <section id="vote" className="mt-10 scroll-mt-6 text-center sm:mt-14 lg:mt-16">
          <GlassPanel className="mx-auto max-w-4xl px-4 py-8 sm:px-10 sm:py-12">
            <h2 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">Cast your vote</h2>
            <p className="mx-auto mt-2 max-w-lg text-xs text-white/50 sm:text-sm">
              Tap an option to sign in (if needed), complete KYC, and confirm your vote.
            </p>
            <div className="mt-6 flex flex-col flex-wrap justify-center gap-2 sm:mt-8 sm:flex-row sm:flex-nowrap sm:gap-3 md:gap-4">
              {options.map((opt, i) => {
                const style = OPTION_STYLES[i % OPTION_STYLES.length];
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleOptionVoteClick(opt)}
                    className={`min-h-[2.75rem] w-full rounded-xl bg-gradient-to-r px-3 py-3 text-center text-xs font-bold leading-tight tracking-wide text-white transition sm:min-h-0 sm:w-auto sm:flex-1 sm:whitespace-nowrap sm:px-3 sm:py-4 sm:text-sm md:text-base ${style.colorClass} ${style.glowClass} hover:opacity-95`}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </section>

  


        {/* Country table */}
        <section className="mt-10 sm:mt-14 lg:mt-16">
          <h2 className="mb-3 text-base font-semibold text-white sm:mb-5 sm:text-lg">Country comparison</h2>
          <GlassPanel className="-mx-1 overflow-x-auto sm:mx-0">
            {countryRowsForTable.length === 0 ? (
              <p className="px-4 py-6 text-sm text-white/50 sm:px-5 sm:py-8">No per-country breakdown returned yet.</p>
            ) : (
              <table className="w-full max-w-full table-fixed text-left text-xs sm:table-auto sm:min-w-[640px] sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50">
                    <th className="sticky left-0 z-[1] w-12 bg-[#0a0f2e]/95 px-1.5 py-3 text-center text-[9px] font-medium uppercase leading-tight text-white/45 backdrop-blur-sm sm:static sm:w-auto sm:bg-transparent sm:px-5 sm:py-4 sm:text-left sm:text-sm sm:normal-case sm:tracking-normal sm:text-white/50 sm:backdrop-blur-none">
                      <span className="sm:hidden">Flag</span>
                      <span className="hidden sm:inline">Country</span>
                    </th>
                    {options.map((opt) => (
                      <th
                        key={opt.id}
                        title={opt.name}
                        className="max-w-[2.5rem] truncate px-0.5 py-2 text-center text-[9px] font-medium leading-tight sm:max-w-none sm:px-3 sm:py-4 sm:text-left sm:text-sm sm:leading-normal"
                      >
                        {opt.name}
                      </th>
                    ))}
                    <th className="w-11 max-w-[2.75rem] px-0.5 py-2 text-center text-[8px] font-medium uppercase leading-tight sm:w-auto sm:max-w-none sm:min-w-[180px] sm:px-5 sm:py-4 sm:text-left sm:text-sm sm:normal-case">
                      <span className="sm:hidden">Dist</span>
                      <span className="hidden sm:inline">Distribution</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {countryRowsForTable.map((row) => {
                    const rowTotal = row.ordered.reduce((s, o) => s + o.votes_count, 0);
                    const iso = countryFlagCode(row.country_id, row.country_name);
                    return (
                      <tr key={row.country_id} className="">
                        <td className="sticky left-0 z-[1] w-12 bg-[#0a0f2e]/90 px-1.5 py-3 backdrop-blur-sm sm:w-auto sm:static sm:bg-transparent sm:px-5 sm:py-4 sm:backdrop-blur-none">
                          <span
                            className="flex min-w-0 items-center justify-center gap-0 font-medium text-white/90 sm:justify-start sm:gap-3"
                            title={row.country_name}
                            aria-label={row.country_name}
                          >
                            {iso ? (
                              <ReactCountryFlag
                                countryCode={iso}
                                svg
                                style={{ width: "1.75em", height: "1.75em" }}
                                title={row.country_name}
                              />
                            ) : (
                              <span
                                className="flex h-[1.75em] w-[1.75em] shrink-0 items-center justify-center rounded bg-white/10 text-base leading-none text-white/70"
                                title={row.country_name}
                                aria-hidden
                              >
                                🌐
                              </span>
                            )}
                            <span className="sr-only sm:not-sr-only sm:min-w-0 sm:break-words">{row.country_name}</span>
                          </span>
                        </td>
                        {row.ordered.map((cell, ci) => {
                          const pct = rowTotal > 0 ? (cell.votes_count / rowTotal) * 100 : 0;
                          return (
                            <td
                              key={cell.option_id}
                              title={`${cell.option_name}: ${formatInt(cell.votes_count)}${rowTotal > 0 ? ` (${pct.toFixed(0)}%)` : ""}`}
                              className="max-w-[2.5rem] truncate px-0.5 py-2 text-center align-middle text-[10px] tabular-nums text-white/80 sm:max-w-none sm:px-3 sm:py-4 sm:text-left sm:text-sm"
                            >
                              <span className="block sm:inline">{formatInt(cell.votes_count)}</span>
                              {rowTotal > 0 ? (
                                <span className="block text-[8px] leading-tight text-white/40 sm:ml-1 sm:inline sm:text-xs">
                                  ({pct.toFixed(0)}%)
                                </span>
                              ) : null}
                            </td>
                          );
                        })}
                        <td className="w-11 max-w-[2.75rem] px-0.5 py-2 sm:w-auto sm:max-w-none sm:px-5 sm:py-4">
                          <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10 sm:h-2.5">
                            {row.ordered.map((cell, ci) => {
                              const w = rowTotal > 0 ? (cell.votes_count / rowTotal) * 100 : 0;
                              const st = OPTION_STYLES[ci % OPTION_STYLES.length];
                              return (
                                <div
                                  key={cell.option_id}
                                  className={`${st.colorClass} ${st.glowClass}`}
                                  style={{ width: `${w}%` }}
                                  title={`${cell.option_name}: ${cell.votes_count}`}
                                />
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </GlassPanel>
        </section>

        {relatedEvents.length > 0 ? (
          <section className="mt-10 sm:mt-14 lg:mt-16">
            <h2 className="mb-3 text-base font-semibold text-white sm:mb-5 sm:text-lg">Related events</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
              {relatedEvents.map((ev) => (
                <GlassPanel key={ev.id} className="flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white">{ev.title}</h3>
                      <p className="mt-1 text-xs text-white/50">
                        {ev.category_name ?? ev.event_type.replace(/-/g, " ")}
                      </p>
                    </div>
                    <PieChartIcon size={36} />
                  </div>
                  <Link
                    href={`/events/test/${ev.id}`}
                    className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-sm font-medium text-white/90 transition hover:bg-white/10"
                  >
                    View Event
                  </Link>
                </GlassPanel>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {showLoginModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 text-sm text-gray-400 hover:text-white"
              onClick={() => setShowLoginModal(false)}
            >
              ✕
            </button>

            <h2 className="mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              Login to vote
            </h2>
            {voteTargetOption && (
              <p className="mb-4 text-sm text-gray-300">
                You are about to vote for{" "}
                <span className="font-semibold text-white">{voteTargetOption.name}</span>. Please login to
                continue.
              </p>
            )}

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = String(formData.get("login-email") ?? "");
                const password = String(formData.get("login-password") ?? "");

                if (!email || !password) return;

                try {
                  setLoginError(null);
                  setLoginLoading(true);

                  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
                  const url = `${baseUrl || "http://localhost:3000"}/api/auth/login`;

                  const res = await fetch(url, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: email, password }),
                  });

                  if (!res.ok) {
                    throw new Error(`Login failed: ${res.status}`);
                  }

                  const body = await res.json();
                  const token = body?.data?.token as string | undefined;
                  const userId = body?.data?.user?.id as string | undefined;
                  const verificationStatus = body?.data?.user?.verification_status as string | undefined;
                  const countryId = body?.data?.user?.country_id as string | undefined;

                  if (!token || !userId) {
                    throw new Error("Invalid login response");
                  }

                  if (typeof window !== "undefined") {
                    window.sessionStorage.setItem("Authorization", `Bearer ${token}`);
                    window.sessionStorage.setItem("UserId", userId);
                    if (countryId) {
                      window.sessionStorage.setItem("CountryId", countryId);
                    } else {
                      window.sessionStorage.removeItem("CountryId");
                    }
                    if (verificationStatus) {
                      window.sessionStorage.setItem("VerificationStatus", verificationStatus);
                    }
                  }

                  setShowLoginModal(false);
                  if (verificationStatus === "unverified") {
                    setShowKycModal(true);
                  } else if (voteTargetOption) {
                    setShowConfirmModal(true);
                  }
                } catch (err: unknown) {
                  setLoginError(err instanceof Error ? err.message : "Login failed");
                } finally {
                  setLoginLoading(false);
                }
              }}
            >
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  name="login-email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  name="login-password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="••••••••"
                />
              </div>
              {loginError && <p className="text-xs text-red-400">{loginError}</p>}
              <button
                type="submit"
                disabled={loginLoading}
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginLoading ? "Logging in..." : "Login & continue"}
              </button>
            </form>

            <p className="mt-3 text-center text-[11px] text-gray-500">
              Don&apos;t have an account yet? Voting requires a quick signup in the main app.
            </p>
          </div>
        </div>
      )}

      {showKycModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-amber-400/40 bg-slate-900 p-5 shadow-2xl sm:p-6">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 text-sm text-gray-400 hover:text-white"
              onClick={() => setShowKycModal(false)}
            >
              ✕
            </button>

            <h2 className="mb-3 bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              KYC verification required
            </h2>
            <p className="mb-4 text-sm text-gray-200">
              Your account is currently{" "}
              <span className="font-semibold text-amber-300">not KYC verified</span>. To participate in
              voting for this event, please complete a quick KYC check.
            </p>

            <div className="mb-4 space-y-3 text-xs text-gray-400">
              <p>Verification helps us:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Keep voting fair and prevent duplicate accounts</li>
                <li>Comply with local regulations</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowKycModal(false);
                router.push("/kyc");
              }}
              className="w-full rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/40 transition-all hover:from-amber-300 hover:to-yellow-400"
            >
              Continue to KYC
            </button>

            <button
              type="button"
              onClick={() => setShowKycModal(false)}
              className="mt-2 w-full rounded-lg border border-gray-600/60 px-4 py-2.5 text-sm font-medium text-gray-200 transition-all hover:bg-gray-800/60"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-md"
          onClick={() => {
            if (voteLoading) return;
            setShowConfirmModal(false);
            setVoteError(null);
            setVoteTargetOption(null);
          }}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden rounded-2xl border border-white/15 shadow-[0_0_60px_rgba(88,28,135,0.35)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="confirm-vote-title"
            aria-describedby="confirm-vote-desc"
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c2a] via-[#151040] to-[#08081c]" />
              <div
                className="absolute inset-0 opacity-[0.45]"
                style={{
                  backgroundImage: `radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,255,255,0.85), transparent),
                    radial-gradient(1px 1px at 78% 22%, rgba(255,255,255,0.6), transparent),
                    radial-gradient(1px 1px at 42% 78%, rgba(255,255,255,0.45), transparent),
                    radial-gradient(1.5px 1.5px at 88% 65%, rgba(255,255,255,0.75), transparent)`,
                  backgroundSize: "100% 100%",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.2),transparent_55%)]" />
            </div>

            <button
              type="button"
              className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-lg leading-none text-white/50 transition hover:bg-white/10 hover:text-white"
              onClick={() => {
                setShowConfirmModal(false);
                setVoteError(null);
                setVoteTargetOption(null);
              }}
              disabled={voteLoading}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="relative z-10 px-4 pb-8 pt-10 text-center sm:px-12 sm:pb-12 sm:pt-14">
              <h2
                id="confirm-vote-title"
                className="text-lg font-semibold tracking-tight text-white sm:text-2xl md:text-[1.65rem]"
              >
                Correct option?
              </h2>
              <p
                id="confirm-vote-desc"
                className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg"
              >
                Is{" "}
                <span className="font-semibold text-white">
                  {voteTargetOption?.name ?? "this option"}
                </span>{" "}
                the one you want to choose? This submits your vote and can&apos;t be undone.
              </p>

              {voteError && (
                <p className="mx-auto mt-4 max-w-md text-sm text-red-400">{voteError}</p>
              )}

              <div className="mx-auto mt-10 flex max-w-md flex-row flex-nowrap items-stretch justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => void handleVoteSubmit()}
                  disabled={voteLoading}
                  className="min-w-0 flex-1 rounded-xl border-t border-white/35 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 py-3.5 text-base font-bold tracking-wide text-white shadow-[0_8px_28px_rgba(59,130,246,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                >
                  {voteLoading ? "Submitting…" : "Vote"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setVoteError(null);
                    setVoteTargetOption(null);
                  }}
                  disabled={voteLoading}
                  className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/5 py-3.5 text-base font-semibold tracking-wide text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                >
                  Cancel
                </button>
              </div>

              {/* <div className="mx-auto mt-10 max-w-2xl border-t border-white/10" /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-xl sm:gap-3 sm:rounded-2xl sm:p-5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden sm:h-9 sm:w-9">
        <div className="flex origin-center scale-[0.72] sm:scale-100">{icon}</div>
      </div>
      <p className="break-words text-sm font-semibold leading-tight tracking-tight text-white sm:text-2xl">{value}</p>
      <p className="line-clamp-2 text-[10px] leading-snug text-white/60 sm:line-clamp-none sm:text-sm">{label}</p>
    </div>
  );
}
