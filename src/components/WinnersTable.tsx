"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { GAMES } from "@/lib/data";

/* Deterministic PRNG (mulberry32) so server + client render identical rows
   → no hydration mismatch, while still looking "random". */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CITIES = [
  "Miami, FL", "Houston, TX", "Chicago, IL", "Atlanta, GA", "Phoenix, AZ",
  "Las Vegas, NV", "Dallas, TX", "Brooklyn, NY", "Detroit, MI", "Tampa, FL",
  "Denver, CO", "Seattle, WA", "Charlotte, NC", "Columbus, OH", "Newark, NJ",
];
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const GAME_NAMES = GAMES.map((g) => g.name);

type Row = { player: string; city: string; game: string; prize: number };

function buildRows(seed: number, maxPrize: number, minPrize: number): Row[] {
  const rng = mulberry32(seed);
  const rows: Row[] = [];
  for (let i = 0; i < 8; i++) {
    const player =
      LETTERS[Math.floor(rng() * LETTERS.length)] +
      LETTERS[Math.floor(rng() * LETTERS.length)] +
      LETTERS[Math.floor(rng() * LETTERS.length)] +
      "*****";
    const city = CITIES[Math.floor(rng() * CITIES.length)];
    const game = GAME_NAMES[Math.floor(rng() * GAME_NAMES.length)];
    const prize = Math.round((minPrize + rng() * (maxPrize - minPrize)) / 5) * 5;
    rows.push({ player, city, game, prize });
  }
  return rows.sort((a, b) => b.prize - a.prize);
}

const TABS = [
  { key: "today", label: "Today", seed: 20260701, min: 60, max: 900 },
  { key: "weekly", label: "Weekly", seed: 77140, min: 500, max: 5200 },
] as const;

export default function WinnersTable() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("today");
  const active = TABS.find((t) => t.key === tab)!;
  const rows = useMemo(() => buildRows(active.seed, active.max, active.min), [active]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* header */}
      <div className="text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-magenta">
          Top Players
        </p>
        <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Winners
        </h2>
        <p className="mx-auto mt-2 flex items-center justify-center gap-2 text-ink-soft">
          Real players, real prizes — updated every hour
          <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-xs font-bold text-lime">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-lime" />
            Live
          </span>
        </p>
      </div>

      {/* toggle */}
      <div className="mx-auto mt-6 flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative cursor-pointer rounded-full px-5 py-2 font-display text-sm font-bold transition-colors ${
              tab === t.key ? "text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {tab === t.key && (
              <motion.span
                layoutId="winners-tab"
                className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{t.label} Winners</span>
          </button>
        ))}
      </div>

      {/* table */}
      <div className="candy-card mt-6 overflow-hidden rounded-2xl">
        {/* column headers */}
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/8 px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-soft sm:grid-cols-[auto_1fr_auto] sm:px-5">
          <span>Player</span>
          <span className="hidden sm:block">Game</span>
          <span className="text-right">Prize</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="divide-y divide-white/6"
          >
            {rows.map((r, i) => (
              <li
                key={i}
                className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:px-5"
              >
                {/* player + city (+ rank medal for top 3) */}
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                      i === 0
                        ? "bg-gold/20 text-gold"
                        : i === 1
                          ? "bg-white/15 text-ink"
                          : i === 2
                            ? "bg-[#cd7f32]/25 text-[#e8a866]"
                            : "bg-white/5 text-ink-soft"
                    }`}
                  >
                    {i < 3 ? <Trophy className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display font-bold text-ink">
                      {r.player}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">{r.city}</span>
                  </span>
                </span>

                {/* game (desktop col) */}
                <span className="hidden truncate text-sm font-semibold text-ink-soft sm:block">
                  {r.game}
                </span>

                {/* prize */}
                <span className="text-right font-display font-extrabold text-lime">
                  {r.prize.toLocaleString("en-US")} SC
                </span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
