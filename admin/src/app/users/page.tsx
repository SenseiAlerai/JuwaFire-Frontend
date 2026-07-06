import { desc } from "drizzle-orm";
import { db, users } from "@juwafire/db";
import { formatUSD } from "@juwafire/db/format";
import { requireStaff } from "@/lib/guard";
import Shell from "@/components/Shell";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await requireStaff();

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      balanceCents: users.balanceCents,
      lifetimeDepositCents: users.lifetimeDepositCents,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(200);

  return (
    <Shell title="Users" user={me}>
      <p className="mb-4 text-sm text-ink-soft">{rows.length} players (most recent first).</p>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase text-ink-soft">
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Lifetime deposits</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-line/60">
                <td className="px-4 py-3">
                  <div className="font-semibold">{u.username ?? "—"}</div>
                  <div className="text-xs text-ink-soft">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.role === "admin" ? "bg-brand/20 text-brand" : u.role === "staff" ? "bg-warn/20 text-warn" : "bg-line text-ink-soft"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{formatUSD(u.balanceCents)}</td>
                <td className="px-4 py-3">{formatUSD(u.lifetimeDepositCents)}</td>
                <td className="px-4 py-3 text-ink-soft">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
