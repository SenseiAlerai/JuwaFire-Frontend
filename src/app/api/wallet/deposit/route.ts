import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { applyTransaction, WalletError } from "@/lib/wallet";
import { creditReferralOnDeposit } from "@/lib/referral";
import { creditFirstDepositBonus } from "@/lib/bonus";

// NOTE: real deposits need a payment gateway. For now this credits test funds
// so the wallet loop is demoable end-to-end. Wire a provider before going live.
const schema = z.object({ amount: z.number().positive().max(5000) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  const amountCents = Math.round(parsed.data.amount * 100);
  try {
    const balance = await applyTransaction(session.user.id, "deposit", amountCents, "Test deposit");
    // Welcome: 20% bonus on the first deposit (best-effort).
    await creditFirstDepositBonus(session.user.id, amountCents);
    // Pay the referrer $10 once this friend has deposited $10+ (best-effort).
    await creditReferralOnDeposit(session.user.id, amountCents);
    // Re-read the balance so the response reflects the deposit + any bonus.
    const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    return NextResponse.json({ ok: true, balanceCents: me?.balanceCents ?? balance });
  } catch (e) {
    const msg = e instanceof WalletError ? e.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
