"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, loadRequests, applyTransaction } from "@juwafire/db";
import { requireStaff } from "@/lib/guard";
import { writeAudit } from "@/lib/audit";

export async function completeLoad(id: string) {
  const me = await requireStaff();
  const [req] = await db.select().from(loadRequests).where(eq(loadRequests.id, id));
  if (!req || req.status !== "pending") return;
  await db.update(loadRequests).set({ status: "completed" }).where(eq(loadRequests.id, id));
  await writeAudit(me.id, "load.complete", "load_request", id, `${req.amountCents}c → ${req.gameKey}`);
  revalidatePath("/loads");
}

export async function rejectLoad(id: string) {
  const me = await requireStaff();
  const [req] = await db.select().from(loadRequests).where(eq(loadRequests.id, id));
  if (!req || req.status !== "pending") return;
  await applyTransaction(req.userId, "adjustment", req.amountCents, `Load to ${req.gameKey} rejected — refund`);
  await db.update(loadRequests).set({ status: "rejected" }).where(eq(loadRequests.id, id));
  await writeAudit(me.id, "load.reject", "load_request", id, `refunded ${req.amountCents}c`);
  revalidatePath("/loads");
}
