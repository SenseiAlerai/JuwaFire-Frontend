import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, gameAccounts } from "@/db/schema";
import { sanitizeBase, makeGameUsername, makeGamePassword } from "@/lib/gameAccount";
import { GAMES } from "@/lib/data";

export const dynamic = "force-dynamic";

const schema = z.object({ gameKey: z.string().min(1).max(60) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { gameKey } = parsed.data;
  if (!GAMES.some((g) => g.name === gameKey)) {
    return NextResponse.json({ error: "Unknown game" }, { status: 400 });
  }

  // already set up? return existing
  const existing = await db.query.gameAccounts.findFirst({
    where: and(eq(gameAccounts.userId, session.user.id), eq(gameAccounts.gameKey, gameKey)),
  });
  if (existing) {
    return NextResponse.json({
      account: {
        gameKey: existing.gameKey,
        gameUsername: existing.gameUsername,
        gamePassword: existing.gamePassword,
        status: existing.status,
      },
    });
  }

  const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  const base = sanitizeBase(me?.username, me?.email);

  // generate a unique username (retry on collision)
  let gameUsername = makeGameUsername(base);
  for (let i = 0; i < 5; i++) {
    const clash = await db.query.gameAccounts.findFirst({
      where: eq(gameAccounts.gameUsername, gameUsername),
    });
    if (!clash) break;
    gameUsername = makeGameUsername(base);
  }
  const gamePassword = makeGamePassword();

  // TODO(phase 2): call the platform API here to create the real account.
  // For now we provision the record and mark it active so the UX works end-to-end.
  const [acct] = await db
    .insert(gameAccounts)
    .values({ userId: session.user.id, gameKey, gameUsername, gamePassword, status: "active" })
    .returning();

  return NextResponse.json({
    account: {
      gameKey: acct.gameKey,
      gameUsername: acct.gameUsername,
      gamePassword: acct.gamePassword,
      status: acct.status,
    },
  });
}
