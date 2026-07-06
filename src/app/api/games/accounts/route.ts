import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, gameAccounts } from "@/db/schema";

export const dynamic = "force-dynamic";

/** Returns the signed-in user's wallet balance + their game accounts keyed by gameKey. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [me, rows] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, session.user.id) }),
    db.query.gameAccounts.findMany({ where: eq(gameAccounts.userId, session.user.id) }),
  ]);

  const accounts: Record<string, { gameUsername: string; gamePassword: string | null; status: string }> = {};
  for (const r of rows) {
    accounts[r.gameKey] = { gameUsername: r.gameUsername, gamePassword: r.gamePassword, status: r.status };
  }

  return NextResponse.json({ balanceCents: me?.balanceCents ?? 0, accounts });
}
