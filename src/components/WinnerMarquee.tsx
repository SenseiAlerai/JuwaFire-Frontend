import { Trophy } from "lucide-react";
import { WINNERS } from "@/lib/data";

/** Edge-to-edge ticker of recent winners (CSS marquee, doubled for seamless loop). */
export default function WinnerMarquee() {
  const row = [...WINNERS, ...WINNERS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-3 backdrop-blur-sm">
      <div className="flex w-max animate-marquee gap-3 motion-reduce:animate-none">
        {row.map((w, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#ffd64d,#ff9a2f)] text-[#1a0e02] shadow-[0_0_12px_rgba(255,182,61,0.7)]">
              <Trophy className="h-3.5 w-3.5" />
            </span>
            <span className="font-display font-semibold text-ink">{w.name}</span>
            <span className="text-ink-soft">won</span>
            <span className="font-display font-bold text-lime">{w.amount}</span>
            <span className="text-ink-soft">on {w.game}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
