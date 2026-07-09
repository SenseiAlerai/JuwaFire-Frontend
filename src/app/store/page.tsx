"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Clock } from "lucide-react";
import { FLASH_SALE, WELCOME_PACKS, FEATURED_PACKS, type CoinPack } from "@/lib/data";
import { useGameAccounts } from "@/components/games/GameAccountsProvider";
import PaymentStrip from "@/components/PaymentStrip";
import { toast } from "@/lib/toast";
import { sfxCoin, sfxError } from "@/lib/sound";

const discountOf = (p: CoinPack) => Math.round((1 - p.price / p.coins) * 100);

// Bigger packs get a fancier chest.
const chestOf = (coins: number) =>
  coins >= 199 ? "/store/chest-diamond.png"
  : coins >= 65 ? "/store/chest-sapphire.png"
  : coins >= 33 ? "/store/chest-gold.png"
  : coins >= 22 ? "/store/chest-bronze.png"
  : "/store/chest-starter.png";
const keyOf = (p: { coins: number; price: number }) => `${p.coins}-${p.price}`;

/** Rolling countdown to the next 3-day boundary (keeps the flash sale "live"). */
function useFlashCountdown() {
  const [label, setLabel] = useState("--:--:--");
  useEffect(() => {
    const period = 3 * 24 * 3600 * 1000;
    const target = Math.ceil(Date.now() / period) * period;
    const tick = () => {
      const ms = Math.max(0, target - Date.now());
      const s = Math.floor(ms / 1000);
      const hh = String(Math.floor(s / 3600)).padStart(2, "0");
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setLabel(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return label;
}

export default function StorePage() {
  const { loggedIn, refresh } = useGameAccounts();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const countdown = useFlashCountdown();

  async function buy(pack: { coins: number; price: number }) {
    if (!loggedIn) {
      router.push("/login");
      return;
    }
    const k = keyOf(pack);
    if (busy) return;
    setBusy(k);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: pack.coins }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Purchase failed");
      await refresh();
      sfxCoin();
      toast(`Added ${pack.coins} coins to your wallet!`, "win");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Purchase failed", "error");
      sfxError();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="px-4 pt-10 pb-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="shine-text text-center font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Store
        </h1>

        {/* FLASH SALE */}
        <h2 className="mt-8 text-center font-display text-xl font-extrabold uppercase tracking-wide text-ink sm:text-2xl">
          Flash Sale – Limited Time
        </h2>
        <div className="mt-4 overflow-hidden rounded-3xl border border-gold/50 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(255,198,61,0.12),transparent)] p-5 shadow-[0_0_40px_-16px_rgba(255,198,61,0.7)]">
          <span className="inline-block rounded-full bg-gold px-3 py-1 font-display text-sm font-extrabold text-[#1a0e02]">
            {FLASH_SALE.title}
          </span>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-display text-4xl font-extrabold text-ink">
                <span className="relative h-12 w-12 shrink-0">
                  <Image src={chestOf(FLASH_SALE.coins)} alt="" fill sizes="48px" className="object-contain" />
                </span>
                {FLASH_SALE.coins}
                <span className="text-lg text-ink-soft">coins</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 font-mono text-sm font-bold text-ink tabular-nums">
                  <Clock className="h-4 w-4 text-ink-soft" /> {countdown}
                </span>
                <span className="rounded-md bg-red px-2 py-0.5 text-[11px] font-bold text-white">Ends Soon</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-ink-soft/70 line-through">was ${FLASH_SALE.coins.toFixed(2)}</p>
              <button
                onClick={() => buy(FLASH_SALE)}
                disabled={busy === keyOf(FLASH_SALE)}
                className="mt-1 flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#5cf07a,#2de2ff)] px-5 py-2.5 font-display text-xl font-extrabold text-[#04210f] transition-transform active:scale-95 disabled:opacity-60"
              >
                {busy === keyOf(FLASH_SALE) && <Loader2 className="h-4 w-4 animate-spin" />}
                ${FLASH_SALE.price}
              </button>
            </div>
          </div>
        </div>

        <PackGrid title="Welcome Packages" packs={WELCOME_PACKS} busy={busy} onBuy={buy} />
        <PackGrid title="Featured Packages" packs={FEATURED_PACKS} busy={busy} onBuy={buy} />

        {/* payment methods */}
        <h2 className="mt-10 text-center font-display text-lg font-extrabold text-ink">
          Choose your payment method:
        </h2>
        <PaymentStrip />
        <p className="mt-3 text-center text-xs text-ink-soft">
          Secure checkout. Coins are added to your wallet instantly after payment.
        </p>
      </div>
    </div>
  );
}

function PackGrid({
  title,
  packs,
  busy,
  onBuy,
}: {
  title: string;
  packs: CoinPack[];
  busy: string | null;
  onBuy: (p: CoinPack) => void;
}) {
  return (
    <>
      <h2 className="mt-10 text-center font-display text-xl font-extrabold uppercase tracking-wide text-ink sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-4">
        {packs.map((p) => (
          <PackCard key={keyOf(p)} pack={p} busy={busy === keyOf(p)} onBuy={onBuy} />
        ))}
      </div>
    </>
  );
}

function PackCard({ pack, busy, onBuy }: { pack: CoinPack; busy: boolean; onBuy: (p: CoinPack) => void }) {
  const off = discountOf(pack);
  return (
    <div className="relative flex flex-col overflow-visible rounded-2xl border border-gold/50 bg-white/[0.03] p-2.5 pt-4">
      {/* badge */}
      {pack.badge && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-2.5 py-0.5 font-display text-[10px] font-extrabold uppercase text-[#1a0e02] shadow">
          {pack.badge}
        </span>
      )}
      {/* discount ribbon */}
      {off > 0 && (
        <span className="absolute -right-1.5 -top-1.5 z-10 rounded-md bg-red px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow">
          {off}%
        </span>
      )}

      {/* art */}
      <div className="grid place-items-center pt-1">
        <span className="relative h-[4.5rem] w-[4.5rem] sm:h-24 sm:w-24">
          <Image src={chestOf(pack.coins)} alt="" fill sizes="96px" className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]" />
        </span>
      </div>

      {/* coin count */}
      <p className="flex items-center justify-center gap-1 text-center font-display text-sm font-extrabold text-ink">
        <span className="text-gold">◈</span>
        {pack.coins}
        <span className="text-xs font-semibold text-ink-soft">coins</span>
      </p>

      {/* price bar / buy */}
      <button
        onClick={() => onBuy(pack)}
        disabled={busy}
        className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#5cf07a,#2de2ff)] px-2 py-2 font-display text-sm font-extrabold text-[#04210f] transition-transform active:scale-95 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span className="text-[11px] font-bold text-[#04210f]/55 line-through">${pack.coins.toFixed(2)}</span>
            <span>${pack.price}</span>
          </>
        )}
      </button>
    </div>
  );
}
