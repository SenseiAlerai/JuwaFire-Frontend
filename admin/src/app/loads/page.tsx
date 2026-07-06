import { desc, eq } from "drizzle-orm";
import { db, loadRequests, users } from "@juwafire/db";
import { formatUSD } from "@juwafire/db/format";
import { requireStaff } from "@/lib/guard";
import Shell from "@/components/Shell";
import { Check, X } from "lucide-react";
import { completeLoad, rejectLoad } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoadsPage() {
  const me = await requireStaff();

  const rows = await db
    .select({
      id: loadRequests.id,
      amountCents: loadRequests.amountCents,
      gameKey: loadRequests.gameKey,
      gameUsername: loadRequests.gameUsername,
      createdAt: loadRequests.createdAt,
      username: users.username,
      email: users.email,
    })
    .from(loadRequests)
    .leftJoin(users, eq(users.id, loadRequests.userId))
    .where(eq(loadRequests.status, "pending"))
    .orderBy(desc(loadRequests.createdAt));

  return (
    <Shell title="Loads" user={me}>
      <p className="mb-4 text-sm text-ink-soft">
        {rows.length} pending load{rows.length === 1 ? "" : "s"}. Complete after crediting the game;
        reject to refund the wallet.
      </p>

      {rows.length === 0 ? (
        <div className="card p-8 text-center text-ink-soft">No pending loads</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase text-ink-soft">
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line/60">
                  <td className="px-4 py-3 font-semibold">{r.username ?? r.email}</td>
                  <td className="px-4 py-3 font-bold text-good">{formatUSD(r.amountCents)}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{r.gameKey}</div>
                    <div className="text-xs text-ink-soft">{r.gameUsername ?? "—"}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={completeLoad.bind(null, r.id)}>
                        <button className="btn bg-good/20 px-3 py-1.5 text-good hover:bg-good/30">
                          <Check className="h-4 w-4" /> Done
                        </button>
                      </form>
                      <form action={rejectLoad.bind(null, r.id)}>
                        <button className="btn bg-bad/20 px-3 py-1.5 text-bad hover:bg-bad/30">
                          <X className="h-4 w-4" /> Reject
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
