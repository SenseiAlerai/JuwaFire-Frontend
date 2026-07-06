import { count, eq, sum } from "drizzle-orm";
import { auth } from "@/auth";
import { db, cashoutRequests, loadRequests, users, gameAccounts } from "@juwafire/db";
import { formatUSD } from "@juwafire/db/format";
import Shell from "@/components/Shell";
import { ArrowDownCircle, ArrowUpCircle, Users, Gamepad2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Overview() {
  const session = await auth();

  const [pendingRedeems, pendingLoads, userCount, acctCount, deposited] = await Promise.all([
    db.select({ c: count() }).from(cashoutRequests).where(eq(cashoutRequests.status, "pending")),
    db.select({ c: count() }).from(loadRequests).where(eq(loadRequests.status, "pending")),
    db.select({ c: count() }).from(users),
    db.select({ c: count() }).from(gameAccounts),
    db.select({ s: sum(users.lifetimeDepositCents) }).from(users),
  ]);

  const cards = [
    { label: "Pending redeems", value: pendingRedeems[0].c, icon: ArrowDownCircle, accent: "#f59e0b", href: "/redeems" },
    { label: "Pending loads", value: pendingLoads[0].c, icon: ArrowUpCircle, accent: "#22c55e", href: "/loads" },
    { label: "Players", value: userCount[0].c, icon: Users, accent: "#b056ff", href: "/users" },
    { label: "Game accounts", value: acctCount[0].c, icon: Gamepad2, accent: "#2de2ff", href: "/users" },
  ];

  return (
    <Shell title="Overview" user={session?.user as { username?: string; email?: string; role?: string }}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `${c.accent}22`, color: c.accent }}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-extrabold">{c.value}</p>
              <p className="text-sm text-ink-soft">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="card mt-6 p-6">
        <p className="text-sm text-ink-soft">Total lifetime deposits (all players)</p>
        <p className="mt-1 text-3xl font-extrabold text-good">
          {formatUSD(Number(deposited[0].s ?? 0))}
        </p>
      </div>
    </Shell>
  );
}
