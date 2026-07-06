import type { Metadata } from "next";
import { CandyLink } from "@/components/CandyButton";
import Reveal from "@/components/Reveal";
import { VIP_TIERS } from "@/lib/data";
import { iconMap } from "@/lib/iconMap";
import { Gift, Headphones, Rocket, Crown, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "VIP Club — JuwaFire",
  description: "Climb the neon ladder from Spark to Ringmaster and unlock sharper perks.",
};

const PERKS = [
  { icon: Gift, title: "Surprise Boxes", text: "Mystery rewards drop into your wallet as you climb." },
  { icon: Headphones, title: "Personal Host", text: "A real human concierge on speed-dial from Neon tier." },
  { icon: Rocket, title: "Faster Payouts", text: "Skip the queue — VIP cashouts are first off the rank." },
  { icon: Crown, title: "Weekly Cashback", text: "Up to 20% of your net losses back, every single week." },
];

export default function VipPage() {
  return (
    <div className="px-4 pt-10">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="text-center">
          <Reveal>
            <span className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display font-semibold text-ink">
              <Sparkles className="h-4 w-4 text-gold" /> The inner circle
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold text-ink sm:text-6xl">
              The <span className="shine-text">VIP Club</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-soft">
              Every deposit moves you up the ladder — from your first Bronze perks all the way to
              full Diamond status and bigger weekly cashback.
            </p>
          </Reveal>
        </div>

        {/* Perks */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="candy-card group h-full rounded-2xl p-6 text-center transition-transform hover:-translate-y-2">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white shadow-[0_0_26px_rgba(255,46,154,0.7)] transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <p.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Tier ladder */}
        <div className="mt-16">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Climb the <span className="text-gold">ladder</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {VIP_TIERS.map((t, i) => {
              const Icon = iconMap[t.icon];
              return (
                <Reveal key={t.name} delay={i * 0.08}>
                  <div
                    className="candy-card relative h-full overflow-hidden rounded-2xl p-6 text-center transition-transform hover:-translate-y-2"
                    style={{ borderColor: `${t.color}55` }}
                  >
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-1"
                      style={{ background: t.color, boxShadow: `0 0 18px ${t.color}` }}
                    />
                    <span
                      className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white"
                      style={{ background: `${t.color}26`, boxShadow: `0 0 24px ${t.color}55` }}
                    >
                      <Icon className="h-8 w-8" style={{ color: t.color }} />
                    </span>
                    <p className="mt-2 font-display text-xs font-bold uppercase tracking-wide text-ink-soft">
                      Tier {i + 1}
                    </p>
                    <h3 className="font-display text-2xl font-bold" style={{ color: t.color }}>
                      {t.name}
                    </h3>
                    <p className="mt-2 font-display text-3xl font-extrabold text-ink">
                      {t.cashback}
                    </p>
                    <p className="text-xs font-semibold uppercase text-ink-soft">net-loss cashback</p>
                    <p className="mt-3 text-sm text-ink-soft">{t.perk}</p>
                    <p className="mt-3 border-t border-white/10 pt-3 text-xs font-semibold text-ink-soft">
                      {t.minDepositCents === 0
                        ? "Starting tier"
                        : `$${(t.minDepositCents / 100).toLocaleString("en-US")}+ deposited`}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-ink-soft">
            Tiers are based on your lifetime deposits and never go down. Cashback is paid weekly as a
            percentage of your net losses (total losses minus wins) for that week.
          </p>
        </div>

        {/* CTA */}
        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(120deg,#1a0a3a,#2a0a3f)] p-10 text-center text-white shadow-[0_30px_80px_-30px_rgba(176,86,255,0.6)] sm:p-16">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_30%,rgba(176,86,255,0.6)_0,transparent_42%),radial-gradient(circle_at_80%_70%,rgba(45,226,255,0.5)_0,transparent_40%)]" />
            <div className="relative">
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
                Start climbing the ranks tonight
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85">
                Every deposit moves you up the ladder. No fee to join — just play, climb, and
                enjoy bigger weekly cashback.
              </p>
              <CandyLink href="/games" variant="gold" size="lg" className="mt-7">
                Play &amp; Climb
              </CandyLink>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
