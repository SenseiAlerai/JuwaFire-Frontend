import { CandyLink } from "@/components/CandyButton";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import GameCard from "@/components/GameCard";
import GamesMarquee from "@/components/GamesMarquee";
import LiveCount from "@/components/LiveCount";
import PaymentStrip from "@/components/PaymentStrip";
import WinnerMarquee from "@/components/WinnerMarquee";
import WinnersTable from "@/components/WinnersTable";
import JackpotTicker from "@/components/JackpotTicker";
import { GAMES } from "@/lib/data";
import { Ticket, Zap, ShieldCheck, Headphones, Clock, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const TRUST = [
  { icon: ShieldCheck, title: "Safe & Secure", text: "Protected payments you can trust.", color: "#2de2ff" },
  { icon: Headphones, title: "24/7 Support", text: "Always here when you need us.", color: "#ff2e9a" },
  { icon: Clock, title: "Same-Day Redemption", text: "Fast, easy cashouts.", color: "#aaff3c" },
  { icon: Crown, title: "Loyalty Club", text: "Unlock exclusive perks & rewards.", color: "#ffc63d" },
];

const STATS = [
  { label: "Players Online", value: "18,402", color: "#ff2e9a" },
  { label: "Games", value: "2,500+", color: "#b056ff" },
  { label: "Avg. Payout", value: "3 min", color: "#aaff3c" },
  { label: "Paid This Week", value: "$4.2M", color: "#2de2ff" },
];

export default function Home() {
  return (
    <>
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Hero />

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HOTTEST GAMES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Hottest <span className="text-magenta">Games</span>
            </h2>
            <Link href="/games" className="font-display font-bold text-magenta hover:text-cyan">
              See all →
            </Link>
          </div>
          {/* mobile: auto-scrolling rail */}
          <div className="md:hidden">
            <GamesMarquee />
          </div>
          {/* desktop: grid */}
          <div className="hidden grid-cols-3 gap-4 md:grid lg:grid-cols-6">
            {GAMES.slice(0, 6).map((g, i) => (
              <GameCard key={g.name} game={g} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ LIVE WINNER TICKER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mt-10">
        <WinnerMarquee />
      </div>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ PAYMENTS + TRUST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 pb-2 pt-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-ink-soft">
            Instant deposits &amp; cashouts via
          </p>
          <PaymentStrip />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            {["Sign up in under 5 min", "No app downloads", "Zero hidden fees", "15-min cashouts"].map(
              (t) => (
                <span key={t} className="neon-chip rounded-full px-3 py-1.5 text-ink-soft">
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ WINNERS TABLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 py-14">
        <Reveal>
          <WinnersTable />
        </Reveal>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ MEGA JACKPOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 py-12">
        <Reveal y={30}>
          <div className="candy-card relative mx-auto max-w-md rounded-[2rem] p-7 text-center">
            <span className="pointer-events-none absolute -inset-px rounded-[2rem] bg-[linear-gradient(120deg,rgba(255,46,154,0.5),rgba(45,226,255,0.4))] opacity-40 blur-md" />
            <div className="relative">
              <p className="font-display font-semibold uppercase tracking-widest text-magenta">
                Mega Jackpot
              </p>
              <JackpotTicker className="mt-1 block font-display text-4xl font-extrabold text-ink drop-shadow-[0_0_24px_rgba(255,198,61,0.45)] sm:text-5xl" />
              <p className="mt-1 text-sm text-ink-soft">growing every second</p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {GAMES.slice(0, 3).map((g) => (
                  <div
                    key={g.name}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
                  >
                    <Image src={g.image} alt={g.name} fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>

              <CandyLink href="/games" variant="gold" size="md" className="mt-6 w-full">
                Play Now
              </CandyLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ WHY PLAYERS CHOOSE US â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center">
              <p className="font-display text-sm font-bold uppercase tracking-widest text-magenta">
                Trusted Platform
              </p>
              <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Why Players <span className="text-magenta">Choose Us</span>
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-ink-soft">
                Everything you need for secure play, fast redeems, and real rewards.
              </p>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {TRUST.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.06}>
                <div className="candy-card group h-full rounded-2xl p-5 text-center transition-transform hover:-translate-y-1 sm:p-6">
                  <span
                    className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white transition-transform group-hover:scale-110"
                    style={{ background: t.color, boxShadow: `0 0 26px ${t.color}66` }}
                  >
                    <t.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink sm:text-lg">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="candy-card rounded-2xl px-4 py-6 text-center">
                <p
                  className="font-display text-3xl font-extrabold sm:text-4xl"
                  style={{ color: s.color, textShadow: `0 0 24px ${s.color}66` }}
                >
                  {s.label === "Players Online" ? <LiveCount base={18402} /> : s.value}
                </p>
                <p className="mt-1 font-semibold text-ink-soft">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 py-14">
        <Reveal>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(120deg,#2a0a3f,#3a0a2e)] p-10 text-center text-white shadow-[0_30px_80px_-30px_rgba(255,46,154,0.6)] sm:p-16">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_18%_20%,rgba(255,46,154,0.55)_0,transparent_42%),radial-gradient(circle_at_82%_75%,rgba(45,226,255,0.5)_0,transparent_40%)]" />
            <div className="relative">
              <div className="mb-4 flex flex-wrap justify-center gap-2 text-sm font-semibold">
                <span className="neon-chip flex items-center gap-1 rounded-full px-3 py-1">
                  <ShieldCheck className="h-4 w-4 text-lime" /> Secure &amp; Fair
                </span>
                <span className="neon-chip flex items-center gap-1 rounded-full px-3 py-1">
                  <Zap className="h-4 w-4 text-gold" /> 3-min payouts
                </span>
              </div>
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
                Ready to feel the rush?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85">
                Sign up tonight and your first deposit gets doubled. The lights are on,
                the wheel is spinning — all that&apos;s missing is you.
              </p>
              <CandyLink href="/promotions" variant="gold" size="lg" className="mt-7">
                <Ticket className="h-5 w-5" /> Get My 100% Bonus
              </CandyLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}



