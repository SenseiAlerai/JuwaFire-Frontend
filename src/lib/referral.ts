import { and, count, desc, eq, like, sum } from "drizzle-orm";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { applyTransaction } from "@/lib/wallet";

/** Flat referral reward paid to the referrer, in cents. */
export const REFERRAL_REWARD_CENTS = 1000; // $10
/** The referred friend must deposit at least this much for the reward to unlock. */
export const REFERRAL_MIN_DEPOSIT_CENTS = 1000; // $10

// Note prefix that tags a *referrer-side* payout, so we can total earnings & list history.
const EARN_PREFIX = "Referral bonus";

function earnNote(friendUsername: string | null) {
  return `${EARN_PREFIX} — @${friendUsername ?? "friend"}`;
}

/**
 * Pay the referrer $10 once a friend they invited deposits $10 or more.
 * Safe to call after every deposit — it only pays out when the deposit clears
 * the minimum, only once per referred friend, and never throws (a referral
 * hiccup must not break the deposit).
 */
export async function creditReferralOnDeposit(
  depositorId: string,
  depositAmountCents: number,
): Promise<void> {
  try {
    if (depositAmountCents < REFERRAL_MIN_DEPOSIT_CENTS) return;

    const friend = await db.query.users.findFirst({ where: eq(users.id, depositorId) });
    if (!friend?.referredBy || friend.referredBy === depositorId) return;

    const referrer = await db.query.users.findFirst({ where: eq(users.id, friend.referredBy) });
    if (!referrer) return;

    // Only reward once per referred friend.
    const note = earnNote(friend.username);
    const [already] = await db
      .select({ id: transactions.id })
      .from(transactions)
      .where(and(eq(transactions.userId, referrer.id), eq(transactions.type, "referral"), eq(transactions.note, note)))
      .limit(1);
    if (already) return;

    await applyTransaction(referrer.id, "referral", REFERRAL_REWARD_CENTS, note);
  } catch {
    // swallow — referral rewards are best-effort and must never block a deposit
  }
}

export type ReferralHistoryEntry = { note: string; amountCents: number; createdAt: Date };

export type ReferralStats = {
  invited: number; // signed up with my link
  qualified: number; // referred friends who deposited $10+ (i.e. paid out)
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
