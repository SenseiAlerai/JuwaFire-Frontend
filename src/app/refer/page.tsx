import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { formatUSD } from "@/lib/format";
import { getReferralStats } from "@/lib/referral";
import Reveal from "@/components/Reveal";
import ReferCard from "@/components/refer/ReferCard";
import { Link2, Coins, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Refer & Earn — JuwaFire",
  description: "Invite friends to JuwaFire and you both get $10.",
};

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: Link2,
    color: "#ff2e9a",
    text: "Invite your friends using your unique referral link.",
  },
  {
    icon: Coins,
    color: "#aaff3c",
    text: "When your referred friend signs up and makes their first deposit, you both get a $10 bonus.",
  },
  {
    icon: Trophy,
    color: "#ffc63d",
    text: "No limit — refer as many friends as you like and keep on earning.",
  },
];

export default async function ReferPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!me) redirect("/login");

  const code = me.username || me.id.slice(0, 8);
  const link = `https://juwafire.com/signup?ref=${code}`;
  const stats = await getReferralStats(me.id);

  const cards = [
    { label: "Invited Friends", value: String(stats.invited), color: "#ff8fb0", ring: "#ff2e9a" },
    { label: "$ Reward Earned", value: formatUSD(stats.earnedCents), color: "#aaff3c", ring: "#5cbb1f" },
    { label: "Qualified Friends", value: String(stats.qualified), color: "#ff6fae", ring: "#b056ff" },
  ];

  return (
    <div className="px-4 pt-10 pb-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Hero + link */}
        <Reveal>
          <ReferCard link={link} />
        </Reveal>

        {/* Invite Friends & Earn — stats */}
        <Reveal>
          <div className="candy-card rounded-[2rem] p-6 sm:p-8">
            <h2 className="text-center font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Invite Friends &amp; Earn
            </h2>
            <p className="mx-auto mt-2 max-w-md text-center text-ink-soft">
              Share your link. When a friend signs up and completes the requirements, both of you get
              rewarded.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {cards.map((c, i) => (
                <div
                  key={c.label}
                  className={`rounded-2xl border bg-white/[0.03] p-5 text-center ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}
                  style={{ borderColor: `${c.ring}66` }}
                >
                  <p className="font-display text-3xl font-extrabold" style={{ color: c.color }}>
                    {c.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-soft">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* How does it work */}
        <Reveal>
          <div className="candy-card rounded-[2rem] p-6 sm:p-8">
            <h2 className="text-center font-display text-2xl font-extrabold text-ink sm:text-3xl">
              How Does It Work?
            </h2>
            <div className="mt-6 space-y-5">
              {STEPS.map((s) => (
                <div key={s.text} className="flex items-start gap-4">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white"
                    style={{ background: s.color, boxShadow: `0 0 22px ${s.color}55` }}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <p className="pt-1.5 font-medium text-ink">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Referral history */}
        <Reveal>
          <div className="candy-card rounded-[2rem] p-6 sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-ink">Your Referrals</h2>
            {stats.history.length > 0 ? (
              <ul className="mt-4 divide-y divide-white/10">
                {stats.history.map((h, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{h.note}</p>
                      <p className="text-xs text-ink-soft">
                        {h.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className="shrink-0 font-display font-bold text-lime">
                      +{formatUSD(h.amountCents)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] py-10 text-center">
                <p className="font-display text-lg font-bold text-ink-soft">No referrals yet</p>
                <p className="mt-1 text-sm text-ink-soft/80">
                  Share your referral link to start earning rewards!
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
