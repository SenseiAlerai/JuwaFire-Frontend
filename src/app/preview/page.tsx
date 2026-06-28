"use client";

import { useState } from "react";
import Image from "next/image";
import WalletActions, { type DemoInput } from "@/components/dashboard/WalletActions";
import { GAMES } from "@/lib/data";
import { ArrowDownToLine, ArrowUpRight, Gift, Sparkles, Eye } from "lucide-react";

const fmt = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

type Tx = { id: number; type: string; amountCents: number; createdAt: Date };

const TX_META: Record<string, { label: string; sign: string; cls: string }> = {
  deposit: { label: "Deposit", sign: "+", cls: "text-lime" },
  load: { label: "Load to game", sign: "−", cls: "text-ink-soft" },
  cashout: { label: "Cashout", sign: "−", cls: "text-gold" },
};

export default function PreviewDashboard() {
  const [balance, setBalance] = useState(25000); // $250.00 sample funds
  const [txs, setTxs] = useState<Tx[]>([
    { id: 1, type: "deposit", amountCents: 20000, createdAt: new Date(Date.now() - 3600_000) },
    { id: 2, type: "load", amountCents: -5000, createdAt: new Date(Date.now() - 1800_000) },
    { id: 3, type: "deposit", amountCents: 10000, createdAt: new Date(Date.now() - 600_000) },
  ]);

  function demoSubmit(input: DemoInput): string | undefined {
    const cents = Math.round(input.amount * 100);
    if (input.tab === "deposit") {
      setBalance((b) => b + cents);
      pushTx("deposit", cents);
      return;
    }
    // load / cashout debit the wallet
    if (cents > balance) return "Insufficient balance";
    setBalance((b) => b - cents);
    pushTx(input.tab, -cents);
    return;
  }

  function pushTx(type: string, amountCents: number) {
    setTxs((t) => [{ id: Date.now(), type, amountCents, createdAt: new Date() }, ...t].slice(0, 10));
  }

  return (
    <div className="px-4 pt-6">
      <div className="mx-auto max-w-6xl">
        {/* preview banner */}
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-cyan/30 bg-cyan/10 px-4 py-2.5 text-sm font-semibold text-cyan">
          <Eye className="h-4 w-4 shrink-0" />
          Preview mode — sample funds, nothing is saved. This is exactly what players see after
          logging in.
        </div>

        <p className="font-display text-ink-soft">Welcome back,</p>
        <h1 className="font-display text-4xl font-extrabold capitalize text-ink sm:text-5xl">
          player
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          {/* Balance card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#2a0a3f,#3a0a2e)] p-8 shadow-[0_30px_70px_-30px_rgba(255,46,154,0.6)]">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_15%_15%,rgba(255,46,154,0.5)_0,transparent_45%),radial-gradient(circle_at_85%_85%,rgba(45,226,255,0.45)_0,transparent_40%)]" />
            <div className="relative">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/70">
                Wallet Balance
              </p>
              <p className="mt-2 font-display text-5xl font-extrabold text-white drop-shadow-[0_0_24px_rgba(255,198,61,0.4)]">
                {fmt(balance)}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="neon-chip rounded-full px-3 py-1 text-white">
                  <Sparkles className="mr-1 inline h-3.5 w-3.5 text-gold" /> Member
                </span>
                <span className="neon-chip rounded-full px-3 py-1 text-white">3-min payouts</span>
              </div>
            </div>
          </div>

          {/* Actions (demo mode) */}
          <WalletActions
            balanceCents={balance}
            games={GAMES.map((g) => g.name)}
            demoSubmit={demoSubmit}
          />
        </div>

        {/* Quick links */}
        <h2 className="mt-12 font-display text-2xl font-extrabold text-ink">Jump back in</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {GAMES.slice(0, 6).map((g) => (
            <a
              key={g.name}
              href={g.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 transition-transform hover:-translate-y-1"
            >
              <Image src={g.image} alt={g.name} fill sizes="120px" className="object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-2 font-display text-xs font-bold text-white">
                {g.name}
              </span>
            </a>
          ))}
        </div>

        {/* Recent activity */}
        <h2 className="mt-12 font-display text-2xl font-extrabold text-ink">Recent activity</h2>
        <div className="candy-card mt-4 overflow-hidden rounded-2xl">
          {txs.length === 0 ? (
            <div className="p-8 text-center text-ink-soft">
              <Gift className="mx-auto h-8 w-8 text-magenta" />
              <p className="mt-2 font-display font-bold text-ink">No activity yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/8">
              {txs.map((t) => {
                const meta = TX_META[t.type] ?? TX_META.deposit;
                const positive = t.amountCents >= 0;
                return (
                  <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/5">
                        {positive ? (
                          <ArrowDownToLine className="h-4 w-4 text-lime" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-gold" />
                        )}
                      </span>
                      <span>
                        <span className="block font-display font-semibold text-ink">
                          {meta.label}
                        </span>
                        <span className="block text-xs text-ink-soft">
                          {t.createdAt.toLocaleString()}
                        </span>
                      </span>
                    </span>
                    <span className={`font-display font-bold ${meta.cls}`}>
                      {meta.sign}
                      {fmt(Math.abs(t.amountCents))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Hook up the database + Google OAuth (see SETUP.md) to make this real and persistent.
        </p>
      </div>
    </div>
  );
}
