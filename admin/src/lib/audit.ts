import { db, auditLog } from "@juwafire/db";

/** Record a staff/admin action in the audit log. */
export async function writeAudit(
  actorId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: string,
) {
  await db.insert(auditLog).values({
    actorId,
    action,
    targetType: targetType ?? null,
    targetId: targetId ?? null,
    details: details ?? null,
  });
}
