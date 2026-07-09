import { and, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { applyTransaction } from "@/lib/wallet";

/** Welcome offer: extra % credited on the player's FIRST deposit. */
export const WELCOME_BONUS_PCT = 0.2; // 20%

/**
 * Credit the 20% welcome bonus on a player's first deposit only.
 * Call right after the deposit transaction is written. Best-effort — a bonus
 * hiccup must never break the deposit.
 */
export async function creditFirstDepositBonus(userId: string, depositAmountCents: number): Promise<void> {
  try {
    if (depositAmountCents <= 0) return;

    // The deposit row was just written, so a first deposit means count === 1.
    const [dep] = await db
      .select({ n: count() })
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.type, "deposit")));
    if (!dep || dep.n !== 1) return;

    const bonusCents = Math.round(depositAmountCents * WELCOME_BONUS_PCT);
    if (bonusCents <= 0) return;
    await applyTransaction(userId, "bonus", bonusCents, "Welcome bonus — 20% first deposit");
  } catch {
    /* best-effort */
  }
}
