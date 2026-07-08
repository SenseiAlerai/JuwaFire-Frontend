import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { applyTransaction } from "@/lib/wallet";
import { computeRank, VIP_RANKS } from "@/lib/rank";

/**
 * Award VIP XP for play (1 coin / $1 played = 100 XP → XP == cents loaded).
 * If the player crosses into a new rank, auto-credit the level-up coin reward.
 * Best-effort: never throws (must not break a load).
 */
export async function awardPlayXp(userId: string, amountCents: number): Promise<void> {
  try {
    if (amountCents <= 0) return;
    const me = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!me) return;

    const oldXp = me.xp ?? 0;
    const newXp = oldXp + amountCents; // $1 = 100 cents = 100 XP
    await db.update(users).set({ xp: newXp }).where(eq(users.id, userId));

    const oldIdx = computeRank(oldXp).index;
    const newIdx = computeRank(newXp).index;
    if (newIdx > oldIdx) {
      let rewardCoins = 0;
      for (let i = oldIdx + 1; i <= newIdx; i++) rewardCoins += VIP_RANKS[i].levelUp;
      if (rewardCoins > 0) {
        await applyTransaction(userId, "bonus", rewardCoins * 100, `VIP ${VIP_RANKS[newIdx].name} level-up reward`);
      }
    }
  } catch {
    /* best-effort — a VIP hiccup must not break the load */
  }
}
