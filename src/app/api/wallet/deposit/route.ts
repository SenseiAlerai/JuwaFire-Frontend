import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { applyTransaction, WalletError } from "@/lib/wallet";

// NOTE: real deposits need a payment gateway. For now this credits test funds
// so the wallet loop is demoable end-to-end. Wire a provider before going live.
const schema = z.object({ amount: z.number().positive().max(5000) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  try {
    const balance = await applyTransaction(
      session.user.id,
      "deposit",
      Math.round(parsed.data.amount * 100),
      "Test deposit",
    );
    return NextResponse.json({ ok: true, balanceCents: balance });
  } catch (e) {
    const msg = e instanceof WalletError ? e.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
