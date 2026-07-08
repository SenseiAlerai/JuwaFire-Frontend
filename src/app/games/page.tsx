"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import GameCard from "@/components/GameCard";
import { GAMES, CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/cn";

export default function GamesPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      const matchCat = cat === "All" || g.category === cat;
      const matchQ = g.name.toLowerCase().includes(query.toLowerCase().trim());
      return matchCat && matchQ;
    });
  }, [cat, query]);

  return (
    <div className="px-4 pt-10">
      <div className="mx-auto max-w-7xl">
        {/* Promo banner */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)]">
          <Image
            src="/banner-welcome.jpg"
            alt="Welcome to JuwaFire — get a 20% bonus on your first deposit"
            width={1778}
            height={884}
            priority
            sizes="(max-width:1280px) 100vw, 1280px"
            className="h-auto w-full"
          />
        </div>

        {/* Controls */}
        <div className="sticky top-24 z-30 mt-6 flex flex-col gap-3 rounded-2xl py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 font-display font-semibold transition-all",
                  cat === c
                    ? "bg-[linear-gradient(120deg,#ff2e9a,#b056ff)] text-white shadow-[0_0_22px_-4px_rgba(255,46,154,0.9)]"
                    : "neon-chip text-ink-soft hover:text-ink",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="relative block sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games…"
              aria-label="Search games"
              className="neon-chip w-full rounded-full py-2.5 pl-10 pr-4 font-medium text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-magenta"
            />
          </label>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filtered.map((g, i) => (
              <GameCard key={g.name} game={g} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="font-display text-2xl font-bold text-ink">No games found</p>
            <p className="text-ink-soft">
              Clear your search or pick another category to keep the night going.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
