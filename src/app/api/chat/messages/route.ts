import { NextResponse } from "next/server";
import { and, asc, eq, gt } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

/** Poll endpoint. GET ?after=<ISO> returns this user's messages after that time. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const after = new URL(req.url).searchParams.get("after");
  const where = after
    ? and(eq(chatMessages.userId, session.user.id), gt(chatMessages.createdAt, new Date(after)))
    : eq(chatMessages.userId, session.user.id);

  const rows = await db.query.chatMessages.findMany({
    where,
    orderBy: [asc(chatMessages.createdAt)],
    limit: 200,
  });

  return NextResponse.json({
    messages: rows.map((m) => ({
      id: m.id,
      sender: m.sender,
      body: m.body,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}
