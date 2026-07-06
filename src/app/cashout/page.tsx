import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { CASHOUT_RULES, CASHOUT_NOTES, VIP_TIERS } from "@/lib/data";
import { iconMap } from "@/lib/iconMap";
import { ShieldCheck, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cashout Rules — JuwaFire",
  description: "Minimum and maximum cashout limits by deposit, daily caps by VIP tier, and redeem rules.",
};

export default function CashoutRulesPage() {
  return (
    <div className="px-4 pt-10 pb-10">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <div className="text-center">
          <Reveal>
            <span className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-lime" /> Please read before playing
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Cashout <span className="text-magenta">Rules</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-ink-soft">
              Clear, simple limits based on your deposit. No confusing wagering math.
            </p>
          </Reveal>
        </div>

        {/* Min/Max table */}
        <Reveal>
          <div className="candy-card mt-8 overflow-hidden rounded-2xl">
            <div className="grid grid-cols-3 gap-3 border-b border-white/10 px-4 py-3 font-display text-xs font-bold uppercase tracking-wide text-ink-soft sm:px-6">
              <span>Deposit</span>
              <span className="text-center">Min cashout</span>
              <span className="text-right">Max cashout</span>
            </div>
            <ul className="divide-y divide-white/6">
              {CASHOUT_RULES.map((r) => (
                <li key={r.load} className="grid grid-cols-3 items-center gap-3 px-4 py-3.5 sm:px-6">
                  <span className="font-display font-bold text-ink">{r.load}</span>
                  <span className="text-center font-semibold text-lime">{r.min}</span>
                  <span className="text-right font-semibold text-gold">{r.max}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="mt-3 text-center text-xs text-ink-soft">
          Any points above your maximum redeem are voided by the system.
        </p>

        {/* Daily cap by VIP tier */}
        <Reveal>
          <div className="mt-10">
            <h2 className="text-center font-display text-2xl font-extrabold text-ink">
              Daily cashout by <span className="text-gold">VIP tier</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-ink-soft">
              The higher your tier, the more you can withdraw per day.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {VIP_TIERS.map((t) => {
                const Icon = iconMap[t.icon];
                return (
                  <div
                    key={t.name}
                    className="candy-card rounded-2xl p-4 text-center"
                    style={{ borderColor: `${t.color}55` }}
                  >
                    <Icon className="mx-auto h-6 w-6" style={{ color: t.color }} />
                    <p className="mt-2 font-display text-sm font-bold" style={{ color: t.color }}>
                      {t.name}
                    </p>
                    <p className="mt-1 font-display text-lg font-extrabold text-ink">
                      ${(t.dailyCashoutCents / 100).toLocaleString("en-US")}
                    </p>
                    <p className="text-[11px] font-semibold uppercase text-ink-soft">per day</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* 24h highlight */}
        <Reveal>
          <div className="candy-card mt-8 flex items-start gap-3 rounded-2xl p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red/15 text-red">
              <Clock className="h-5 w-5" />
            </span>
            <p className="text-sm text-ink">
              <span className="font-bold">Play it or lose it:</span> you must cash out or play your
              deposit within <span className="font-bold text-red">24 hours</span>, or it will be voided.
            </p>
          </div>
        </Reveal>

        {/* Other rules */}
        <Reveal>
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
              <AlertTriangle className="h-5 w-5 text-gold" /> Other rules
            </h2>
            <ul className="mt-3 space-y-2">
              {CASHOUT_NOTES.map((n) => (
                <li key={n} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-magenta" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-xs text-ink-soft">
          Rules help keep JuwaFire fair and secure for everyone. Management reserves the right to
          update these terms. No purchase necessary. 18+.
        </p>
      </div>
    </div>
  );
}
