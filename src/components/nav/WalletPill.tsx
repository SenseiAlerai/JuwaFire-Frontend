"use client";

import Link from "next/link";
import { Coins, Plus } from "lucide-react";
import { formatUSD } from "@/lib/format";
import { useGameAccounts } from "@/components/games/GameAccountsProvider";

/** Header wallet pill: live balance + a quick "add funds" button. */
export default function WalletPill() {
  const { balanceCents, ready } = useGameAccounts();
  return (
    <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 py-1 pl-2.5 pr-1 shadow-[0_0_18px_-6px_rgba(255,198,61,0.8)]">
      <Link href="/dashboard" aria-label="Wallet" className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffd64d,#ff9a2f)] text-[#1a0e02]">
          <Coins className="h-3.5 w-3.5" />
        </span>
        <span className="font-display text-sm font-bold text-ink tabular-nums">
          {ready ? formatUSD(balanceCents) : "—"}
        </span>
      </Link>
      <Link
        href="/store"
        aria-label="Buy coins"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffc63d,#ff5c3b)] text-[#1a0e02]"
      >
        <Plus className="h-4 w-4" strokeWidth={3} />
      </Link>
    </div>
  );
}
