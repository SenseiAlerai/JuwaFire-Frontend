import { desc, eq } from "drizzle-orm";
import { db, cashoutRequests, users } from "@juwafire/db";
import { formatUSD } from "@juwafire/db/format";
import { requireStaff } from "@/lib/guard";
import Shell from "@/components/Shell";
import { Check, X } from "lucide-react";
import { approveRedeem, rejectRedeem } from "./actions";

export const dynamic = "force-dynamic";

export default async function RedeemsPage() {
  const me = await requireStaff();

  const rows = await db
    .select({
      id: cashoutRequests.id,
      amountCents: cashoutRequests.amountCents,
      method: cashoutRequests.method,
      destination: cashoutRequests.destination,
      createdAt: cashoutRequests.createdAt,
      username: users.username,
      email: users.email,
      balanceCents: users.balanceCents,
      lifetimeDepositCents: users.lifetimeDepositCents,
    })
    .from(cashoutRequests)
    .leftJoin(users, eq(users.id, cashoutRequests.userId))
    .where(eq(cashoutRequests.status, "pending"))
    .orderBy(desc(cashoutRequests.createdAt));

  return (
    <Shell title="Redeems" user={me}>
      <p className="mb-4 text-sm text-ink-soft">
        {rows.length} pending withdrawal{rows.length === 1 ? "" : "s"}. Approve after you&apos;ve paid
        the player; reject to refund their wallet.
      </p>

      {rows.length === 0 ? (
        <div className="card p-8 text-center text-ink-soft">No pending redeems 🎉</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase text-ink-soft">
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payout</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{r.username ?? r.email}</div>
                    <div className="text-xs text-ink-soft">
                      Bal {formatUSD(r.balanceCents ?? 0)} · Lifetime {formatUSD(r.lifetimeDepositCents ?? 0)}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-good">{formatUSD(r.amountCents)}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold capitalize">{r.method}</div>
                    <div className="text-xs text-ink-soft">{r.destination}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={approveRedeem.bind(null, r.id)}>
                        <button className="btn bg-good/20 px-3 py-1.5 text-good hover:bg-good/30">
                          <Check className="h-4 w-4" /> Paid
                        </button>
                      </form>
                      <form action={rejectRedeem.bind(null, r.id)}>
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
