import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { loadRequests } from "@/db/schema";
import { applyTransaction, WalletError } from "@/lib/wallet";
import { awardPlayXp } from "@/lib/vipXp";

const schema = z.object({
  amount: z.number().positive().max(5000),
  gameKey: z.string().min(1),
  gameUsername: z.string().max(60).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const cents = Math.round(parsed.data.amount * 100);
  try {
    // debit the wallet first (throws if insufficient), then log the request
    const balance = await applyTransaction(
      session.user.id,
      "load",
      -cents,
      `Load to ${parsed.data.gameKey}`,
    );
    await db.insert(loadRequests).values({
      userId: session.user.id,
      gameKey: parsed.data.gameKey,
      gameUsername: parsed.data.gameUsername || null,
      amountCents: cents,
      status: "pending",
    });
    // Playing earns VIP XP (and may unlock a level-up reward).
    await awardPlayXp(session.user.id, cents);
    return NextResponse.json({ ok: true, balanceCents: balance });
  } catch (e) {
    const msg = e instanceof WalletError ? e.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
