"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import type { Game, HomeSection } from "@/lib/data";
import { useGameAccounts } from "@/components/games/GameAccountsProvider";

function ShelfCard({
  game,
  fav,
  onToggleFav,
  rank,
}: {
  game: Game;
  fav: boolean;
  onToggleFav: (name: string) => void;
  rank?: number;
}) {
  const { openGame } = useGameAccounts();
  return (
    <div className={rank ? "relative flex items-end pl-7" : "relative"}>
      {rank && (
        <span
          className="pointer-events-none absolute bottom-1 left-0 z-10 font-display text-5xl font-black leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,198,61,0.9)]"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
        >
          {rank}
        </span>
      )}
      <button
        onClick={() => openGame(game)}
        aria-label={game.name}
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/12 text-left shadow-[0_14px_30px_-16px_rgba(0,0,0,0.85)]"
      >
        <Image src={game.image} alt={game.name} fill sizes="30vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* favorite */}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onToggleFav(game.name); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onToggleFav(game.name); } }}
          aria-label={fav ? "Remove favorite" : "Add favorite"}
          className="absolute right-1.5 top-1.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/45 backdrop-blur-sm transition-transform active:scale-90"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-magenta text-magenta" : "text-white"}`} />
        </span>

        {/* hover play */}
        <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] px-4 py-2 font-display text-sm font-bold text-white shadow-lg">
            <Play className="h-4 w-4 fill-current" /> Play
          </span>
        </span>
      </button>
    </div>
  );
}

export default function GameShelf({
  section,
  favs,
  onToggleFav,
}: {
  section: HomeSection;
  favs: Set<string>;
  onToggleFav: (name: string) => void;
}) {
  return (
    <section id={`sec-${section.key}`} className="scroll-mt-32 pt-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-gold sm:text-2xl">
            {section.title}
          </h2>
          <Link
            href="/games"
            className="rounded-full border border-gold/50 px-3 py-1 font-display text-xs font-bold uppercase text-gold transition-colors hover:bg-gold/10"
          >
            Show All
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl overflow-hidden">
        {section.ranked ? (
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4">
            {section.games.map((g, i) => (
              <div key={`${g.name}-${i}`} className="w-[42%] shrink-0 snap-start sm:w-[26%]">
                <ShelfCard game={g} fav={favs.has(g.name)} onToggleFav={onToggleFav} rank={i + 1} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-scrollbar grid grid-flow-col grid-rows-2 gap-3 overflow-x-auto px-4 [grid-auto-columns:30%] sm:[grid-auto-columns:22%]">
            {section.games.map((g, i) => (
              <ShelfCard key={`${g.name}-${i}`} game={g} fav={favs.has(g.name)} onToggleFav={onToggleFav} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
