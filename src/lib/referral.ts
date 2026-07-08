import { and, count, desc, eq, like, sum } from "drizzle-orm";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { applyTransaction } from "@/lib/wallet";

/** Flat referral reward, in cents. Both the referrer and the new player get this. */
export const REFERRAL_REWARD_CENTS = 1000; // $10

// Note prefix that tags a *referrer-side* payout, so we can total earnings & list history.
const EARN_PREFIX = "Referral bonus";

function earnNote(friendUsername: string | null) {
  return `${EARN_PREFIX} — @${friendUsername ?? "friend"}`;
}

/**
 * Credit both sides of a referral the first time a referred player deposits.
 * Safe to call after every deposit — it only pays out on the player's FIRST
 * deposit, and never throws (a referral hiccup must not break the deposit).
 */
export async function creditReferralOnFirstDeposit(depositorId: string): Promise<void> {
  try {
    // Only the player's very first deposit qualifies. applyTransaction has
    // already written the deposit row, so a first deposit means count === 1.
    const [dep] = await db
      .select({ n: count() })
      .from(transactions)
      .where(and(eq(transactions.userId, depositorId), eq(transactions.type, "deposit")));
    if (!dep || dep.n !== 1) return;

    const friend = await db.query.users.findFirst({ where: eq(users.id, depositorId) });
    if (!friend?.referredBy || friend.referredBy === depositorId) return;

    const referrer = await db.query.users.findFirst({ where: eq(users.id, friend.referredBy) });
    if (!referrer) return;

    // Referrer earns $10; the new player gets a $10 welcome bonus too.
    await applyTransaction(referrer.id, "referral", REFERRAL_REWARD_CENTS, earnNote(friend.username));
    await applyTransaction(
      friend.id,
      "referral",
      REFERRAL_REWARD_CENTS,
      `Welcome referral bonus (referred by @${referrer.username ?? "a friend"})`,
    );
  } catch {
    // swallow — referral rewards are best-effort and must never block a deposit
  }
}

export type ReferralHistoryEntry = { note: string; amountCents: number; createdAt: Date };

export type ReferralStats = {
  invited: number; // signed up with my link
  qualified: number; // referred friends who deposited (i.e. paid out)
  earnedCents: number; // total $ I earned from referrals
  history: ReferralHistoryEntry[];
};

/** Live referral stats for the given referrer. */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const [[invitedRow], [earnRow], history] = await Promise.all([
    db
      .select({ n: count() })
      .from(users)
      .where(eq(users.referredBy, userId)),
    db
      .select({ total: sum(transactions.amountCents), n: count() })
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.type, "referral"), like(transactions.note, `${EARN_PREFIX}%`))),
    db
      .select({ note: transactions.note, amountCents: transactions.amountCents, createdAt: transactions.createdAt })
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.type, "referral"), like(transactions.note, `${EARN_PREFIX}%`)))
      .orderBy(desc(transactions.createdAt))
      .limit(20),
  ]);

  return {
    invited: invitedRow?.n ?? 0,
    qualified: earnRow?.n ?? 0,
    earnedCents: Number(earnRow?.total ?? 0),
    history: history.map((h) => ({ note: h.note ?? "", amountCents: h.amountCents, createdAt: h.createdAt })),
  };
}
