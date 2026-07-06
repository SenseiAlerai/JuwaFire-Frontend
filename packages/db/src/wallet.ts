import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, transactions } from "./schema";

export type TxType = "deposit" | "load" | "cashout" | "bonus" | "adjustment";

export class WalletError extends Error {}

/**
 * Apply a signed amount to a user's balance and write a ledger row,
 * atomically and with a row lock so concurrent requests can't double-spend.
 * Returns the new balance in cents.
 */
export async function applyTransaction(
  userId: string,
  type: TxType,
  amountCents: number,
  note?: string,
): Promise<number> {
  if (!Number.isInteger(amountCents) || amountCents === 0) {
    throw new WalletError("Invalid amount");
  }

  return db.transaction(async (tx) => {
    const [row] = await tx
      .select({ balance: users.balanceCents })
      .from(users)
      .where(eq(users.id, userId))
      .for("update");

    if (!row) throw new WalletError("Account not found");

    const next = row.balance + amountCents;
    if (next < 0) throw new WalletError("Insufficient balance");

    // Deposits also accrue lifetime deposits (drives VIP tier — never decreases).
    const patch =
      type === "deposit" && amountCents > 0
        ? { balanceCents: next, lifetimeDepositCents: sql`${users.lifetimeDepositCents} + ${amountCents}` }
        : { balanceCents: next };
    await tx.update(users).set(patch).where(eq(users.id, userId));
    await tx.insert(transactions).values({
      userId,
      type,
      amountCents,
      balanceAfterCents: next,
      note,
    });

    return next;
  });
}

// money formatters live in ./format (client-safe); re-exported for convenience
export { formatUSD, toCents, fromCents } from "./format";
