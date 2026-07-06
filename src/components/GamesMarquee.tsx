"use client";

import Image from "next/image";
import { GAMES } from "@/lib/data";
import { useGameAccounts } from "./games/GameAccountsProvider";

/** Auto-scrolling row of game cards (pauses on touch/hover). Mobile rail.
 *  Cards use an EXPLICIT height (h-48) so nothing can collapse them. */
export default function GamesMarquee() {
  const { openGame } = useGameAccounts();
  return (
    <div className="-mx-4 overflow-hidden py-1">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-y-0 left-0 flex w-max animate-marquee items-start gap-3 px-4 [animation-duration:18s] hover:[animation-play-state:paused] active:[animation-play-state:paused] motion-reduce:animate-none">
          {[...GAMES, ...GAMES].map((g, i) => (
            <button
              key={`${g.name}-${i}`}
              onClick={() => openGame(g)}
              aria-label={`Open ${g.name}`}
              className="relative block h-48 w-36 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/12 text-left shadow-[0_14px_30px_-16px_rgba(0,0,0,0.85)]"
            >
              <Image src={g.image} alt={g.name} fill sizes="144px" className="object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

              {g.badge && (
                <span
                  className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm"
                  style={{ background: `${g.badge.color}cc` }}
                >
                  {g.badge.label}
                </span>
              )}

              <span className="absolute inset-x-0 bottom-0 p-2.5">
                <span className="block font-display text-sm font-bold leading-tight text-white drop-shadow">
                  {g.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: g.accent, boxShadow: `0 0 8px ${g.accent}` }}
                  />
                  <span className="text-xs font-semibold text-white/80">{g.subtitle}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
