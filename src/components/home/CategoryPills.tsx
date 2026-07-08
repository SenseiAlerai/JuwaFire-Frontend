"use client";

import Link from "next/link";
import {
  Search, Sparkles, Flame, Trophy, Dice5, Fish, Rocket, Zap,
  LayoutGrid, Crosshair, Radio, Ticket, Hash, Cherry,
} from "lucide-react";
import { HOME_SECTIONS } from "@/lib/data";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  new: Sparkles, hot: Flame, top10: Trophy, table: Dice5, fishing: Fish,
  crash: Rocket, instant: Zap, keno: LayoutGrid, shooting: Crosshair,
  live: Radio, scratch: Ticket, bingo: Hash, slots: Cherry,
};

export default function CategoryPills() {
  function jump(key: string) {
    document.getElementById(`sec-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-24 z-30 bg-[#05060f] py-2 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.9)]">
      {/* one contained horizontal-scroll row: search + pills scroll together */}
      <div className="no-scrollbar mx-auto flex max-w-3xl items-center gap-2 overflow-x-auto px-4">
        {/* search → games page */}
        <Link
          href="/games"
          className="flex w-[52vw] max-w-[240px] shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-2 py-2 text-ink-soft"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffc63d,#ff7a2f)] text-[#1a0e02]">
            <Search className="h-4 w-4" />
          </span>
          <span className="truncate text-sm">Search games…</span>
        </Link>

        {/* category pills */}
        {HOME_SECTIONS.map((s) => {
          const Icon = ICONS[s.key] ?? Sparkles;
          return (
            <button
              key={s.key}
              onClick={() => jump(s.key)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 font-display text-sm font-bold text-ink transition-colors hover:bg-white/10"
            >
              <Icon className="h-4 w-4 text-cyan" />
              {s.title.replace(" Games", "")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
