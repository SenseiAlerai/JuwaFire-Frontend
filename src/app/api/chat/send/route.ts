import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

const schema = z.object({
  body: z.string().trim().max(2000).optional(),
  imageUrl: z.string().startsWith("/uploads/").max(300).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }
  const { body, imageUrl } = parsed.data;
  if (!body && !imageUrl) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const [msg] = await db
    .insert(chatMessages)
    .values({ userId: session.user.id, sender: "user", body: body || null, imageUrl: imageUrl || null })
    .returning();

  return NextResponse.json({
    message: {
      id: msg.id,
      sender: msg.sender,
      body: msg.body,
      imageUrl: msg.imageUrl,
      createdAt: msg.createdAt.toISOString(),
    },
  });
}
