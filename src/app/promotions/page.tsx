import type { Metadata } from "next";
import { CandyLink } from "@/components/CandyButton";
import Reveal from "@/components/Reveal";
import { PROMOS } from "@/lib/data";
import { iconMap } from "@/lib/iconMap";

export const metadata: Metadata = {
  title: "Promotions â€” JuwaFire",
  description: "Daily wheel spins, welcome bonuses, cashback and happy-hour jackpots.",
};

const FAQ = [
  {
    q: "How do I claim the welcome bonus?",
    a: "Just sign up and make your first deposit â€” the 100% match and free spins land in your wallet automatically.",
  },
  {
    q: "Can I spin the wheel more than once a day?",
    a: "Every player gets one free daily spin. VIP members from Neon tier up unlock bonus spins.",
  },
  {
    q: "Do bonuses have wagering requirements?",
    a: "Yes â€” a friendly 20x on bonus funds, one of the lowest on the strip. Full terms on each offer.",
  },
];

export default function PromotionsPage() {
  return (
    <div className="px-4 pt-10">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="text-center">
          <Reveal>
            <h1 className="font-display text-5xl font-extrabold text-ink sm:text-6xl">
              Bonuses &amp; <span className="shine-text">Drops</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-soft">
              The lights never dim. Grab a welcome bonus, spin the daily wheel, and collect
              cashback every week. Everyone leaves the floor with something.
            </p>
          </Reveal>
        </div>

        {/* Featured welcome banner */}
        <Reveal>
          <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(120deg,#3a0a2e,#1a0a3a)] p-8 text-white shadow-[0_30px_80px_-30px_rgba(255,46,154,0.6)] sm:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_12%_20%,rgba(255,46,154,0.6)_0,transparent_42%),radial-gradient(circle_at_88%_80%,rgba(45,226,255,0.5)_0,transparent_40%)]" />
            <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <span className="neon-chip rounded-full px-3 py-1 text-sm font-bold">
                  NEW PLAYERS
                </span>
                <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
                  100% up to $1,500
                </h2>
                <p className="mt-2 max-w-md text-white/85">
                  Plus 200 free spins on Sugar Smash. Double your first deposit and walk
                  straight into the rush.
                </p>
              </div>
              <CandyLink href="/games" variant="gold" size="lg">
                Claim Now
              </CandyLink>
            </div>
          </div>
        </Reveal>

        {/* Promo grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PROMOS.map((p, i) => {
            const Icon = iconMap[p.icon];
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="candy-card group h-full rounded-2xl p-7 transition-transform hover:-translate-y-2">
                  <div className="flex items-start justify-between">
                    <span
                      className="grid h-16 w-16 place-items-center rounded-2xl text-white transition-transform group-hover:rotate-6 group-hover:scale-110"
                      style={{ background: `linear-gradient(150deg, ${p.from}, ${p.to})`, boxShadow: `0 0 28px ${p.from}66` }}
                    >
                      <Icon className="h-8 w-8" />
                    </span>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold text-white"
                      style={{ background: p.from }}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 text-ink-soft">{p.blurb}</p>
                  <CandyLink href="/games" variant="ghost" size="sm" className="mt-5">
                    {p.cta}
                  </CandyLink>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="text-center font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Good to know
          </h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06}>
                <details className="candy-card group rounded-2xl p-5 [&_summary]:cursor-pointer">
                  <summary className="flex items-center justify-between font-display text-lg font-bold text-ink marker:content-['']">
                    {f.q}
                    <span className="ml-3 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-ink transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-ink-soft">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


