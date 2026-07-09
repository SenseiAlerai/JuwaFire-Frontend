import Image from "next/image";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import Reveal from "@/components/Reveal";
import RankBadge from "@/components/vip/RankBadge";
import VipFaq from "@/components/vip/VipFaq";
import { VIP_RANKS, computeRank } from "@/lib/rank";
import { UserPlus, Zap, Gamepad2, Gift, ArrowUpFromLine, Layers, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

const PERKS = [
  { icon: UserPlus, title: "Create an Account", text: "Join JuwaFire and become part of the VIP Rank Program." },
  { icon: Zap, title: "Engage with JuwaFire", text: "All play and engagement earns VIP Points and boosts your rank." },
  { icon: Gamepad2, title: "Play Games, Earn VIP Points", text: "1 coin played in games = 100 XP." },
  { icon: Gift, title: "Earn Ranks, Get Rewards", text: "Each rank has its own rewards that are simple and easy to claim." },
];

const num = (n: number) => n.toLocaleString("en-US");

export default async function VipPage() {
  const session = await auth();
  let xp = 0;
  if (session?.user?.id) {
    const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    xp = me?.xp ?? 0;
  }
  const { index: currentIdx } = computeRank(xp);

  return (
    <div className="px-4 pt-8 pb-10">
      <div className="mx-auto max-w-2xl">
        {/* Hero banner */}
        <Reveal>
          <div
            className="relative aspect-[2/1] overflow-hidden rounded-[1.75rem] border border-gold/50 shadow-[0_0_50px_-18px_rgba(255,198,61,0.85)]"
            style={{ background: "linear-gradient(100deg,#c98bff 0%,#7a2ca8 40%,#140a22 76%)" }}
          >
            <Image
              src="/promos/promo-vip.png"
              alt=""
              fill
              priority
              sizes="(max-width:768px) 100vw, 672px"
              className="object-contain object-bottom [object-position:right_bottom] [mask-image:linear-gradient(90deg,transparent,#000_42%)]"
            />
            <div className="absolute inset-y-0 left-0 flex max-w-[60%] flex-col justify-center px-6">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-gold">
                The Inner Circle
              </span>
              <span className="shine-text mt-1 font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">
                VIP Club
              </span>
              <span className="mt-2 text-sm font-semibold text-white/85">
                Play, climb the ranks, unlock bigger rewards.
              </span>
            </div>
          </div>
        </Reveal>

        {/* VIP Perks */}
        <h2 className="mt-10 text-center font-display text-2xl font-extrabold text-ink sm:text-3xl">VIP Perks</h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="candy-card h-full rounded-2xl p-4 text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white shadow-[0_0_20px_rgba(255,46,154,0.6)]">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-2 font-display text-sm font-extrabold text-gold">{p.title}</h3>
                <p className="mt-1 text-xs text-ink-soft">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Levels */}
        <h2 className="mt-12 text-center font-display text-2xl font-extrabold uppercase tracking-wide text-ink sm:text-3xl">
          Levels
        </h2>
        <div className="mt-6 space-y-8">
          {VIP_RANKS.map((r, i) => {
            const active = i === currentIdx;
            const denom = r.xpNext || 0;
            const fill = denom > 0 ? Math.min(100, Math.round((xp / denom) * 100)) : xp > 0 ? 100 : 0;
            const rewards = [
              { icon: Gift, label: "Level Up Reward", value: r.levelUp },
              { icon: ArrowUpFromLine, label: "Withdrawal Limit", value: r.withdraw },
              { icon: Layers, label: "Platform Games Withdrawal Limit", value: r.platformWithdraw },
              { icon: Wallet, label: "Platform Games Bonus", value: r.platformBonus },
            ];
            return (
              <div key={r.name} className="relative pt-8">
                {/* badge overlaps the card top */}
                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
                  <RankBadge name={r.name} color={r.color} size={84} glow={active} />
                </div>
                <div
                  className="rounded-3xl border bg-[rgba(12,14,26,0.9)] px-5 pb-5 pt-12"
                  style={
                    active
                      ? { borderColor: r.color, boxShadow: `0 0 32px -6px ${r.color}` }
                      : { borderColor: "rgba(255,255,255,0.10)" }
                  }
                >
                  <h3 className="text-center font-display text-3xl font-extrabold text-ink">{r.name}</h3>

                  {/* progress */}
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/12">
                    <div className="h-full rounded-full" style={{ width: `${fill}%`, background: r.color }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs font-semibold text-ink-soft">
                    <span>
                      {num(Math.min(xp, denom || xp))}/{num(denom)}
                    </span>
                    <span>Next Level: {num(denom)}+</span>
                  </div>

                  {/* rewards */}
                  <div className="mt-4 space-y-3">
                    {rewards.map((rw) => (
                      <div key={rw.label} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2.5 font-display font-bold text-ink">
                          <rw.icon className="h-5 w-5 text-gold" />
                          {rw.label}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 font-display font-extrabold text-ink">
                          <span className="h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#7bed4a,#2f8f14)] ring-1 ring-lime/40" />
                          {num(rw.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <h2 className="mt-12 text-center font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <VipFaq />
      </div>
    </div>
  );
}
