import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import Reveal from "@/components/Reveal";
import ReferCard from "@/components/refer/ReferCard";
import { UserPlus, Gift, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Refer & Earn — JuwaFire",
  description: "Invite friends to JuwaFire and you both get $10.",
};

export const dynamic = "force-dynamic";

const STEPS = [
  { icon: UserPlus, title: "Share your link", text: "Send your unique link to friends.", color: "#ff2e9a" },
  { icon: Gift, title: "They join & play", text: "Your friend signs up and starts playing.", color: "#b056ff" },
  { icon: Wallet, title: "You both get $10", text: "$10 lands in each of your wallets.", color: "#aaff3c" },
];

export default async function ReferPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!me) redirect("/login");

  const code = me.username || me.id.slice(0, 8);
  const link = `https://juwafire.com/signup?ref=${code}`;

  return (
    <div className="px-4 pt-10 pb-10">
      <div className="mx-auto max-w-2xl">
        {/* Hero */}
        <div className="text-center">
          <Reveal>
            <span className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display font-semibold text-ink">
              <Gift className="h-4 w-4 text-gold" /> Refer &amp; Earn
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Give <span className="text-lime">$10</span>, Get <span className="text-lime">$10</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">
              Invite your friends to JuwaFire. When they join and play, you both pocket a
              <span className="font-bold text-ink"> $10 bonus</span> — no limits on how many you refer.
            </p>
          </Reveal>
        </div>

        {/* Referral link card */}
        <div className="mt-8">
          <Reveal>
            <ReferCard link={link} />
          </Reveal>
        </div>

        {/* How it works */}
        <div className="mt-10">
          <h2 className="text-center font-display text-2xl font-extrabold text-ink">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="candy-card h-full rounded-2xl p-5 text-center">
                  <span
                    className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white"
                    style={{ background: s.color, boxShadow: `0 0 24px ${s.color}66` }}
                  >
                    <s.icon className="h-6 w-6" />
                  </span>
                  <p className="mt-3 font-display text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                    Step {i + 1}
                  </p>
                  <h3 className="font-display text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-soft">
          Referral bonuses are credited once your friend creates an account and plays. One bonus per
          new player. No purchase necessary.
        </p>
      </div>
    </div>
  );
}
