import { desc, inArray } from "drizzle-orm";
import { db, users } from "@juwafire/db";
import { requireAdmin } from "@/lib/guard";
import Shell from "@/components/Shell";
import { UserPlus, ShieldOff } from "lucide-react";
import { createStaff, revokeStaff } from "./actions";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const me = await requireAdmin();

  const rows = await db
    .select({ id: users.id, username: users.username, email: users.email, role: users.role, createdAt: users.createdAt })
    .from(users)
    .where(inArray(users.role, ["admin", "staff"]))
    .orderBy(desc(users.createdAt));

  return (
    <Shell title="Staff" user={me}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* create */}
        <div className="card h-fit p-6">
          <h2 className="mb-1 font-bold">Add staff</h2>
          <p className="mb-4 text-sm text-ink-soft">They can handle requests &amp; chat, but not manage staff.</p>
          <form action={createStaff} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Username</label>
              <input name="username" required minLength={3} className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-brand" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Password</label>
              <input name="password" type="text" required minLength={6} className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-brand" />
              <p className="mt-1 text-xs text-ink-soft">Share this with them; min 6 characters.</p>
            </div>
            <button className="btn w-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-2.5 text-white">
              <UserPlus className="h-4 w-4" /> Create staff
            </button>
          </form>
        </div>

        {/* list */}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase text-ink-soft">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b border-line/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{u.username}</div>
                    <div className="text-xs text-ink-soft">{u.email ?? "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.role === "admin" ? "bg-brand/20 text-brand" : "bg-warn/20 text-warn"}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== me.id && u.role !== "admin" ? (
                      <form action={revokeStaff.bind(null, u.id)} className="inline">
                        <button className="btn border border-line px-3 py-1.5 text-ink-soft hover:text-bad">
                          <ShieldOff className="h-4 w-4" /> Revoke
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-ink-soft">{u.id === me.id ? "you" : "—"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
