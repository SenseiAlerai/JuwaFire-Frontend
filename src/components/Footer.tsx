import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

const COLS = [
  { title: "Play", links: ["Slots", "Live Casino", "Jackpots", "Crash Games"] },
  { title: "Rewards", links: ["Promotions", "VIP Club", "Tournaments", "Refer a Friend"] },
  { title: "Help", links: ["Support", "Payments", "Responsible Play", "FAQ"] },
];

export default function Footer() {
  return (
    <footer className="mt-24 px-3 pb-28 sm:px-5 md:pb-8">
      <div className="candy-card mx-auto max-w-7xl rounded-[2rem] p-8 sm:p-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Image
              src="/juwafire-logo.png"
              alt="JuwaFire Sweepstakes Games"
              width={1024}
              height={1024}
              className="h-auto w-[108px] drop-shadow-[0_0_16px_rgba(255,46,154,0.28)]"
            />
            <p className="mt-4 max-w-xs text-ink-soft">
              The brightest lights on the strip. Electric games, real jackpots and a rush
              that never sleeps. Step into the glow.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold text-ink">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-ink-soft transition-colors hover:text-magenta">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} JuwaFire. Play for fun, win for real. 18+</p>
          <p className="flex items-center gap-2 rounded-full bg-lime/10 px-3 py-1 font-display font-semibold text-lime">
            <ShieldCheck className="h-4 w-4" /> Licensed &amp; Fair
          </p>
        </div>
      </div>
    </footer>
  );
}
