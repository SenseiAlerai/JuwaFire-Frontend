"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, cashoutRequests, applyTransaction } from "@juwafire/db";
import { requireStaff } from "@/lib/guard";
import { writeAudit } from "@/lib/audit";

export async function approveRedeem(id: string) {
  const me = await requireStaff();
  const [req] = await db.select().from(cashoutRequests).where(eq(cashoutRequests.id, id));
  if (!req || req.status !== "pending") return;

  await db.update(cashoutRequests).set({ status: "completed" }).where(eq(cashoutRequests.id, id));
  await writeAudit(me.id, "redeem.approve", "cashout_request", id, `${req.amountCents}c via ${req.method} → ${req.destination}`);
  revalidatePath("/redeems");
}

export async function rejectRedeem(id: string) {
  const me = await requireStaff();
  const [req] = await db.select().from(cashoutRequests).where(eq(cashoutRequests.id, id));
  if (!req || req.status !== "pending") return;

  // wallet was debited when the request was made — refund it
  await applyTransaction(req.userId, "adjustment", req.amountCents, "Redeem rejected — refund");
  await db.update(cashoutRequests).set({ status: "rejected" }).where(eq(cashoutRequests.id, id));
  await writeAudit(me.id, "redeem.reject", "cashout_request", id, `refunded ${req.amountCents}c`);
  revalidatePath("/redeems");
}
