"use server";

import { revalidatePath } from "next/cache";
import { db, chatMessages } from "@juwafire/db";
import { requireStaff } from "@/lib/guard";

export async function replyChat(userId: string, formData: FormData) {
  await requireStaff();
  const body = String(formData.get("body") ?? "").trim();
  if (!body || !userId) return;
  await db.insert(chatMessages).values({ userId, sender: "admin", body });
  revalidatePath("/chat");
}
