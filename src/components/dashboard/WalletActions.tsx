"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Gamepad2, Banknote } from "lucide-react";
import { CandyButton } from "@/components/CandyButton";
import { toast } from "@/lib/toast";
import { sfxCoin, sfxClick, sfxError } from "@/lib/sound";
import { cn } from "@/lib/cn";

type Tab = "deposit" | "load" | "cashout";

const TABS: { key: Tab; label: string; icon: typeof Plus; variant: "primary" | "win" | "gold" }[] = [
  { key: "deposit", label: "Add Balance", icon: Plus, variant: "win" },
  { key: "load", label: "Load to Game", icon: Gamepad2, variant: "primary" },
  { key: "cashout", label: "Cash Out", icon: Banknote, variant: "gold" },
];

const METHODS = [
  { key: "cashapp", label: "Cash App" },
  { key: "paypal", label: "PayPal" },
  { key: "chime", label: "Chime" },
  { key: "zelle", label: "Zelle" },
];

const inputCls =
  "neon-chip w-full rounded-xl px-4 py-3 font-medium text-ink outline-none focus:border-magenta placeholder:text-ink-soft/60";

export type DemoInput = {
  tab: Tab;
  amount: number;
  gameKey?: string;
  gameUsername?: string;
  method?: string;
  destination?: string;
};

export default function WalletActions({
  balanceCents,
  games,
  demoSubmit,
}: {
  balanceCents: number;
  games: string[];
  /** When provided, actions run locally (preview mode) instead of hitting the API.
   *  Return an error string to reject, or undefined on success. */
  demoSubmit?: (input: DemoInput) => string | undefined;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("");
  const [gameKey, setGameKey] = useState(games[0] ?? "");
  const [gameUsername, setGameUsername] = useState("");
  const [method, setMethod] = useState(METHODS[0].key);
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setAmount("");
    setGameUsername("");
    setDestination("");
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }

    let url = "";
    let payload: Record<string, unknown> = {};
    if (tab === "deposit") {
      url = "/api/wallet/deposit";
      payload = { amount: amt };
    } else if (tab === "load") {
      url = "/api/wallet/load";
      payload = { amount: amt, gameKey, gameUsername };
    } else {
      url = "/api/wallet/cashout";
      if (!destination.trim()) {
        setError("Enter where to send your cashout");
        return;
      }
      payload = { amount: amt, method, destination: destination.trim() };
    }

    const msgs: Record<Tab, string> = {
      deposit: "Balance added!",
      load: "Load request sent — your game account will be credited shortly.",
      cashout: "Cashout requested — we'll process it within minutes.",
    };

    // Preview mode — run locally, no server.
    if (demoSubmit) {
      const err = demoSubmit({ tab, amount: amt, gameKey, gameUsername, method, destination: destination.trim() });
      if (err) {
        sfxError();
        setError(err);
        return;
      }
      (tab === "deposit" ? sfxCoin : sfxClick)();
      toast(msgs[tab], "success");
      reset();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        sfxError();
        setError(data.error ?? "Something went wrong");
        return;
      }
      (tab === "deposit" ? sfxCoin : sfxClick)();
      toast(msgs[tab], "success");
      reset();
      router.refresh();
    } catch {
      setLoading(false);
      setError("Network error. Try again.");
    }
  }

  return (
    <div className="candy-card rounded-[2rem] p-6 sm:p-7">
      {/* tab switcher */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setError(null);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-2 py-3 font-display text-sm font-bold transition-all",
              tab === t.key
                ? "bg-white/10 text-ink shadow-[0_0_20px_-6px_rgba(176,86,255,0.9)]"
                : "text-ink-soft hover:bg-white/5 hover:text-ink",
            )}
          >
            <t.icon className="h-5 w-5" />
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {/* amount */}
        <label className="block">
          <span className="mb-1.5 block font-display text-sm font-semibold text-ink">
            Amount (USD)
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-ink-soft">
              $
            </span>
            <input
              type="number"
              min="1"
              step="1"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={cn(inputCls, "pl-8")}
              required
            />
          </div>
          {tab !== "deposit" && (
            <span className="mt-1 block text-xs text-ink-soft">
              Available: ${(balanceCents / 100).toFixed(2)}
            </span>
          )}
        </label>

        {/* load fields */}
        {tab === "load" && (
          <>
            <label className="block">
              <span className="mb-1.5 block font-display text-sm font-semibold text-ink">Game</span>
              <select
                value={gameKey}
                onChange={(e) => setGameKey(e.target.value)}
                className={inputCls}
              >
                {games.map((g) => (
                  <option key={g} value={g} className="bg-bg-2 text-ink">
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-display text-sm font-semibold text-ink">
                Your game username (optional)
              </span>
              <input
                type="text"
                value={gameUsername}
                onChange={(e) => setGameUsername(e.target.value)}
                placeholder="account on that platform"
                className={inputCls}
              />
            </label>
          </>
        )}

        {/* cashout fields */}
        {tab === "cashout" && (
          <>
            <label className="block">
              <span className="mb-1.5 block font-display text-sm font-semibold text-ink">
                Payout method
              </span>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={inputCls}
              >
                {METHODS.map((m) => (
                  <option key={m.key} value={m.key} className="bg-bg-2 text-ink">
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-display text-sm font-semibold text-ink">
                Send to
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="$cashtag, email or handle"
                className={inputCls}
                required
              />
            </label>
          </>
        )}

        {error && (
          <p className="rounded-xl bg-red/15 px-3 py-2 text-sm font-semibold text-red">{error}</p>
        )}

        <CandyButton
          type="submit"
          variant={TABS.find((t) => t.key === tab)!.variant}
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Working…" : TABS.find((t) => t.key === tab)!.label}
        </CandyButton>
      </form>
    </div>
  );
}
