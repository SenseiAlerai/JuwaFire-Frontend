import Image from "next/image";
import { GAMES, WINNERS } from "@/lib/data";

const imgFor = (game: string) => GAMES.find((g) => g.name === game)?.image ?? "/games/game-juwa.png";

/** Auto-scrolling strip of recent winners: game art + who won + how much. */
export default function RecentBigWins() {
  const row = [...WINNERS, ...WINNERS];
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold text-ink">
        <span className="h-2.5 w-2.5 rounded-full bg-red shadow-[0_0_10px_#ff3b5c]" />
        Recent Big Wins
      </h2>
      <div className="-mx-4 overflow-hidden">
        <div className="flex w-max animate-marquee gap-3 px-4 [animation-duration:30s] hover:[animation-play-state:paused] active:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((w, i) => (
            <div
              key={i}
              className="flex w-[104px] shrink-0 flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 text-center"
            >
              <span className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/12">
                <Image src={imgFor(w.game)} alt={w.game} fill sizes="64px" className="object-cover" />
              </span>
              <span className="mt-2 w-full truncate font-display text-sm font-bold text-ink">{w.name}</span>
              <span className="w-full truncate text-xs font-bold text-lime">{w.amount}</span>
              <span className="w-full truncate text-[10px] text-ink-soft">{w.game}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
