import { redirect } from "next/navigation";
import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { formatUSD } from "@/lib/wallet";
import { computeRank } from "@/lib/rank";
import RankBadge from "@/components/vip/RankBadge";
import WalletActions from "@/components/dashboard/WalletActions";
import { GAMES } from "@/lib/data";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, Gift, Sparkles, ScrollText } from "lucide-react";

export const dynamic = "force-dynamic";

const TX_META: Record<string, { label: string; sign: string; cls: string }> = {
  deposit: { label: "Deposit", sign: "+", cls: "text-lime" },
  bonus: { label: "Bonus", sign: "+", cls: "text-lime" },
  adjustment: { label: "Adjustment", sign: "", cls: "text-ink" },
  load: { label: "Load to game", sign: "−", cls: "text-ink-soft" },
  cashout: { label: "Cashout", sign: "−", cls: "text-gold" },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!me) redirect("/login");

  const recent = await db.query.transactions.findMany({
    where: eq(transactions.userId, me.id),
    orderBy: [desc(transactions.createdAt)],
    limit: 8,
  });

  const greeting = me.username || me.name || "player";

  // VIP rank from XP earned by playing.
  const xp = me.xp ?? 0;
  const { rank, next, isMax, pct, xpToNext } = computeRank(xp);
  const num = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="px-4 pt-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-ink-soft">Welcome back,</p>
        <h1 className="font-display text-4xl font-extrabold capitalize text-ink sm:text-5xl">
          {greeting}
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          {/* Balance card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#2a0a3f,#3a0a2e)] p-8 shadow-[0_30px_70px_-30px_rgba(255,46,154,0.6)]">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_15%_15%,rgba(255,46,154,0.5)_0,transparent_45%),radial-gradient(circle_at_85%_85%,rgba(45,226,255,0.45)_0,transparent_40%)]" />
            <div className="relative">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/70">
                Wallet Balance
              </p>
              <p className="mt-2 font-display text-5xl font-extrabold text-white drop-shadow-[0_0_24px_rgba(255,198,61,0.4)]">
                {formatUSD(me.balanceCents)}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="neon-chip rounded-full px-3 py-1 text-white">
                  <Sparkles className="mr-1 inline h-3.5 w-3.5 text-gold" /> Member
                </span>
                <span className="neon-chip rounded-full px-3 py-1 text-white">3-min payouts</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <WalletActions balanceCents={me.balanceCents} games={GAMES.map((g) => g.name)} />
            <Link
              href="/cashout"
              className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-magenta transition-colors hover:text-cyan"
            >
              <ScrollText className="h-4 w-4" /> View cashout limits &amp; rules
            </Link>
          </div>
        </div>

        {/* VIP progress */}
        <div className="candy-card mt-6 overflow-hidden rounded-[2rem] p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RankBadge color={rank.color} stars={rank.stars} size={48} glow />
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
                  VIP Rank
                </p>
                <h3 className="font-display text-xl font-extrabold" style={{ color: rank.color }}>
                  {rank.name}
                </h3>
                <p className="text-xs font-semibold text-ink-soft">
                  Withdrawal limit {num(rank.withdraw)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-display font-bold text-gold">
              {num(xp)} XP
            </div>
          </div>

          {/* progress bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-soft">
              <span>{rank.name}</span>
              <span>{next ? next.name : "Max rank"}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${rank.color}, ${next ? next.color : "#ffc63d"})`,
                  boxShadow: `0 0 16px ${rank.color}aa`,
                }}
              />
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {isMax ? (
                <>You&apos;ve reached the top — <span className="font-bold text-gold">{rank.name}</span> unlocked.</>
              ) : (
                <>
                  Play <span className="font-bold text-ink">{num(xpToNext)}</span> more XP to reach{" "}
                  <span className="font-bold" style={{ color: next!.color }}>{next!.name}</span>.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick links to play */}
        <h2 className="mt-12 font-display text-2xl font-extrabold text-ink">Jump back in</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {GAMES.slice(0, 6).map((g) => (
            <a
              key={g.name}
              href={g.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 transition-transform hover:-translate-y-1"
            >
              <Image src={g.image} alt={g.name} fill sizes="120px" className="object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-2 font-display text-xs font-bold text-white">
                {g.name}
              </span>
            </a>
          ))}
        </div>

        {/* Recent activity */}
        <h2 className="mt-12 font-display text-2xl font-extrabold text-ink">Recent activity</h2>
        <div className="candy-card mt-4 overflow-hidden rounded-2xl">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-ink-soft">
              <Gift className="mx-auto h-8 w-8 text-magenta" />
              <p className="mt-2 font-display font-bold text-ink">No activity yet</p>
              <p className="text-sm">Add balance and load up a game to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/8">
              {recent.map((t) => {
                const meta = TX_META[t.type] ?? TX_META.adjustment;
                const positive = t.amountCents >= 0;
                return (
                  <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-ink-soft">
                        {positive ? (
                          <ArrowDownToLine className="h-4 w-4 text-lime" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-gold" />
                        )}
                      </span>
                      <span>
                        <span className="block font-display font-semibold text-ink">
                          {meta.label}
                        </span>
                        <span className="block text-xs text-ink-soft">
                          {new Date(t.createdAt).toLocaleString()}
                        </span>
                      </span>
                    </span>
                    <span className={`font-display font-bold ${meta.cls}`}>
                      {meta.sign}
                      {formatUSD(Math.abs(t.amountCents))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Add Balance currently credits test funds for demo. A real payment gateway will be wired
          before launch.
        </p>
      </div>
    </div>
  );
}
