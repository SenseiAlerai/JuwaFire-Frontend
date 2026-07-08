"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Sparkles, LogIn, Loader2, Copy, Check, Eye, EyeOff, Plus, ArrowDownCircle } from "lucide-react";
import type { Game } from "@/lib/data";
import { toast } from "@/lib/toast";
import { sfxCoin, sfxError } from "@/lib/sound";
import { useGameAccounts } from "./GameAccountsProvider";

function CredField({
  label,
  value,
  trailing,
}: {
  label: string;
  value: string;
  trailing?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-ink">{value}</p>
      </div>
      {trailing}
      <button
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-soft hover:bg-white/10 hover:text-ink"
      >
        {copied ? <Check className="h-4 w-4 text-lime" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function GameRow({ game }: { game: Game }) {
  const { loggedIn, ready, accounts, openGame, refresh } = useGameAccounts();
  const account = accounts[game.name];
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState(false);

  async function setup() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/games/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameKey: game.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Setup failed");
      await refresh();
      sfxCoin();
      toast(`${game.name} account created!`, "win");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Setup failed", "error");
      sfxError();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="candy-card rounded-2xl p-4">
      {/* header row: art + name */}
      <div className="flex items-center gap-3">
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/12">
          <Image src={game.image} alt={game.name} fill sizes="64px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-extrabold text-ink">{game.name}</h3>
          <p className="truncate text-sm text-ink-soft">{game.subtitle}</p>
        </div>
        {loggedIn && ready && account && (
          <span className="shrink-0 rounded-full bg-lime/15 px-2.5 py-1 text-[11px] font-bold text-lime ring-1 ring-lime/30">
            Active
          </span>
        )}
        {game.badge && !(loggedIn && ready && account) && (
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25"
            style={{ background: `${game.badge.color}cc` }}
          >
            {game.badge.label}
          </span>
        )}
      </div>

      {/* actions */}
      <div className="mt-3">
        {!loggedIn && (
          <button
            onClick={() => openGame(game)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-3 font-display font-bold text-ink transition-transform active:scale-95"
          >
            <LogIn className="h-4 w-4" /> Log in to play
          </button>
        )}

        {loggedIn && !ready && <div className="h-12 w-full animate-pulse rounded-2xl bg-white/5" />}

        {loggedIn && ready && !account && (
          <button
            onClick={setup}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-3 font-display font-extrabold text-white transition-transform active:scale-95 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {busy ? "Creating…" : "Register"}
          </button>
        )}

        {loggedIn && ready && account && (
          <div className="space-y-2">
            <CredField label="Game ID" value={account.gameUsername} />
            <CredField
              label="Password"
              value={reveal ? account.gamePassword ?? "—" : "••••••••"}
              trailing={
                <button
                  onClick={() => setReveal((r) => !r)}
                  aria-label={reveal ? "Hide password" : "Show password"}
                  className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-soft hover:bg-white/10 hover:text-ink"
                >
                  {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => openGame(game)}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-2.5 font-display font-bold text-white transition-transform active:scale-95"
              >
                <Plus className="h-4 w-4" /> Add Credits
              </button>
              <button
                onClick={() => openGame(game)}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 py-2.5 font-display font-bold text-ink transition-colors hover:bg-white/10"
              >
                <ArrowDownCircle className="h-4 w-4" /> Withdraw
              </button>
            </div>
            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#aaff3c,#2de2ff)] py-3 font-display font-extrabold text-[#0a1402] transition-transform active:scale-95"
            >
              <Play className="h-5 w-5 fill-current" /> Play Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
