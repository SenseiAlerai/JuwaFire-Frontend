"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play, ArrowUpCircle, ArrowDownCircle, Copy, Check, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import type { Game } from "@/lib/data";
import { formatUSD } from "@/lib/format";
import { toast } from "@/lib/toast";
import { sfxCoin, sfxError } from "@/lib/sound";
import { useGameAccounts } from "./GameAccountsProvider";

type Mode = "main" | "load" | "redeem";

const METHODS = [
  { key: "cashapp", label: "Cash App" },
  { key: "chime", label: "Chime" },
  { key: "zelle", label: "Zelle" },
  { key: "paypal", label: "PayPal" },
];

function Copyable({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-ink">{value}</p>
      </div>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
        className="ml-2 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-soft hover:bg-white/10 hover:text-ink"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4 text-lime" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function GamePanel({ game, onClose }: { game: Game | null; onClose: () => void }) {
  const { accounts, balanceCents, refresh } = useGameAccounts();
  const [mode, setMode] = useState<Mode>("main");
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0].key);
  const [destination, setDestination] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const open = !!game;
  const account = game ? accounts[game.name] : undefined;

  function close() {
    onClose();
    // reset after the exit animation
    setTimeout(() => {
      setMode("main");
      setAmount("");
      setDestination("");
      setErr(null);
      setReveal(false);
    }, 250);
  }

  async function setup() {
    if (!game || busy) return;
    setBusy(true);
    setErr(null);
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
      setErr(e instanceof Error ? e.message : "Setup failed");
      sfxError();
    } finally {
      setBusy(false);
    }
  }

  async function submitLoad() {
    if (!game || !account || busy) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) return setErr("Enter an amount");
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/wallet/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, gameKey: game.name, gameUsername: account.gameUsername }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Load failed");
      await refresh();
      sfxCoin();
      toast(`Loading ${formatUSD(amt * 100)} to ${game.name}`, "win");
      setAmount("");
      setMode("main");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      sfxError();
    } finally {
      setBusy(false);
    }
  }

  async function submitRedeem() {
    if (!game || busy) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) return setErr("Enter an amount");
    if (destination.trim().length < 2) return setErr("Enter your payout details");
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/wallet/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, method, destination: destination.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Redeem failed");
      await refresh();
      toast(`Redeem request for ${formatUSD(amt * 100)} submitted`, "win");
      setAmount("");
      setDestination("");
      setMode("main");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Redeem failed");
      sfxError();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && game && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 z-[71] mx-auto max-w-sm -translate-y-1/2 overflow-hidden rounded-3xl border border-white/12 bg-[rgba(10,12,26,0.98)] shadow-[0_30px_90px_-20px_rgba(176,86,255,0.6)]"
          >
            {/* header with game art */}
            <div className="relative h-24 overflow-hidden">
              <Image src={game.image} alt={game.name} fill sizes="380px" className="object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,26,1)] to-black/30" />
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <h2 className="absolute bottom-2 left-4 font-display text-2xl font-extrabold text-white drop-shadow">
                {game.name}
              </h2>
            </div>

            <div className="p-5">
              {/* NO ACCOUNT → set up */}
              {!account && (
                <div className="text-center">
                  <p className="font-display font-bold text-ink">Set up your {game.name} account</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    One tap creates your player account. You&apos;ll get a username &amp; password to log
                    in and play.
                  </p>
                  {err && <p className="mt-3 text-sm text-red">{err}</p>}
                  <button
                    onClick={setup}
                    disabled={busy}
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-3.5 font-display font-extrabold text-white transition-transform active:scale-95 disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    {busy ? "Creating…" : "Set Up Account"}
                  </button>
                </div>
              )}

              {/* HAS ACCOUNT → credentials + actions */}
              {account && mode === "main" && (
                <>
                  <div className="space-y-2">
                    <Copyable label="Username" value={account.gameUsername} />
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <Copyable
                          label="Password"
                          value={reveal ? account.gamePassword ?? "—" : "••••••••"}
                        />
                      </div>
                      <button
                        onClick={() => setReveal((r) => !r)}
                        aria-label={reveal ? "Hide password" : "Show password"}
                        className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/5 text-ink-soft hover:text-ink"
                      >
                        {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#aaff3c,#2de2ff)] py-3.5 font-display font-extrabold text-[#0a1402] transition-transform active:scale-95"
                  >
                    <Play className="h-5 w-5 fill-current" /> Play {game.name}
                  </a>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setErr(null); setMode("load"); }}
                      className="flex items-center justify-center gap-1.5 rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-3 font-display font-bold text-white transition-transform active:scale-95"
                    >
                      <ArrowUpCircle className="h-4 w-4" /> Load
                    </button>
                    <button
                      onClick={() => { setErr(null); setMode("redeem"); }}
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 py-3 font-display font-bold text-ink transition-colors hover:bg-white/10"
                    >
                      <ArrowDownCircle className="h-4 w-4" /> Redeem
                    </button>
                  </div>
                  <p className="mt-3 text-center text-xs text-ink-soft">
                    Wallet balance: <span className="font-bold text-ink">{formatUSD(balanceCents)}</span>
                  </p>
                </>
              )}

              {/* LOAD form */}
              {account && mode === "load" && (
                <div>
                  <p className="font-display font-bold text-ink">Load to {game.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Deducted from your wallet ({formatUSD(balanceCents)}).
                  </p>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount ($)"
                    className="neon-chip mt-3 w-full rounded-xl px-4 py-3 font-medium text-ink outline-none focus:border-magenta"
                  />
                  {err && <p className="mt-2 text-sm text-red">{err}</p>}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setMode("main")} className="rounded-2xl border border-white/15 bg-white/5 py-3 font-display font-bold text-ink-soft hover:text-ink">Back</button>
                    <button onClick={submitLoad} disabled={busy} className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-3 font-display font-bold text-white disabled:opacity-60">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Load
                    </button>
                  </div>
                </div>
              )}

              {/* REDEEM form */}
              {account && mode === "redeem" && (
                <div>
                  <p className="font-display font-bold text-ink">Redeem from {game.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">Subject to cashout rules &amp; daily limits.</p>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount ($)"
                    className="neon-chip mt-3 w-full rounded-xl px-4 py-3 font-medium text-ink outline-none focus:border-magenta"
                  />
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {METHODS.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setMethod(m.key)}
                        className={`rounded-xl px-1 py-2 text-xs font-bold transition-colors ${method === m.key ? "bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white" : "neon-chip text-ink-soft"}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Your $cashtag / handle / email"
                    className="neon-chip mt-2 w-full rounded-xl px-4 py-3 font-medium text-ink outline-none focus:border-magenta"
                  />
                  {err && <p className="mt-2 text-sm text-red">{err}</p>}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setMode("main")} className="rounded-2xl border border-white/15 bg-white/5 py-3 font-display font-bold text-ink-soft hover:text-ink">Back</button>
                    <button onClick={submitRedeem} disabled={busy} className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ffd64d,#ff9a2f)] py-3 font-display font-bold text-[#1a0e02] disabled:opacity-60">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Redeem
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
