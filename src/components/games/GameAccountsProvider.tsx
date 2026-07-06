"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Game } from "@/lib/data";
import GamePanel from "./GamePanel";

export type GameAccount = {
  gameUsername: string;
  gamePassword: string | null;
  status: string;
};

type Ctx = {
  loggedIn: boolean;
  ready: boolean;
  balanceCents: number;
  accounts: Record<string, GameAccount>;
  refresh: () => Promise<void>;
  openGame: (game: Game) => void;
};

const GameAccountsCtx = createContext<Ctx | null>(null);

export function useGameAccounts() {
  const ctx = useContext(GameAccountsCtx);
  if (!ctx) throw new Error("useGameAccounts must be used within GameAccountsProvider");
  return ctx;
}

export default function GameAccountsProvider({
  loggedIn,
  children,
}: {
  loggedIn: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(!loggedIn);
  const [balanceCents, setBalanceCents] = useState(0);
  const [accounts, setAccounts] = useState<Record<string, GameAccount>>({});
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const refresh = useCallback(async () => {
    if (!loggedIn) return;
    try {
      const res = await fetch("/api/games/accounts", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setBalanceCents(data.balanceCents ?? 0);
      setAccounts(data.accounts ?? {});
    } finally {
      setReady(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openGame = useCallback(
    (game: Game) => {
      if (!loggedIn) {
        router.push("/login");
        return;
      }
      setActiveGame(game);
    },
    [loggedIn, router],
  );

  return (
    <GameAccountsCtx.Provider value={{ loggedIn, ready, balanceCents, accounts, refresh, openGame }}>
      {children}
      <GamePanel game={activeGame} onClose={() => setActiveGame(null)} />
    </GameAccountsCtx.Provider>
  );
}
