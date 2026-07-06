import { desc, eq } from "drizzle-orm";
import { db, auditLog, users } from "@juwafire/db";
import { requireStaff } from "@/lib/guard";
import Shell from "@/components/Shell";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const me = await requireStaff();

  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      targetType: auditLog.targetType,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
      actor: users.username,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorId))
    .orderBy(desc(auditLog.createdAt))
    .limit(200);

  return (
    <Shell title="Audit Log" user={me}>
      <p className="mb-4 text-sm text-ink-soft">Every staff action, most recent first.</p>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase text-ink-soft">
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-soft">No actions yet.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-b border-line/60">
                <td className="px-4 py-3 text-ink-soft">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold">{r.actor ?? "—"}</td>
                <td className="px-4 py-3"><code className="text-brand">{r.action}</code></td>
                <td className="px-4 py-3 text-ink-soft">{r.details ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
