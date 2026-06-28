import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { cashoutRequests } from "@/db/schema";
import { applyTransaction, WalletError } from "@/lib/wallet";

const schema = z.object({
  amount: z.number().positive().max(5000),
  method: z.enum(["cashapp", "paypal", "chime", "zelle"]),
  destination: z.string().min(2).max(120),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const cents = Math.round(parsed.data.amount * 100);
  try {
    const balance = await applyTransaction(
      session.user.id,
      "cashout",
      -cents,
      `Cashout via ${parsed.data.method}`,
    );
    await db.insert(cashoutRequests).values({
      userId: session.user.id,
      amountCents: cents,
      method: parsed.data.method,
      destination: parsed.data.destination,
      status: "pending",
    });
    return NextResponse.json({ ok: true, balanceCents: balance });
  } catch (e) {
    const msg = e instanceof WalletError ? e.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
