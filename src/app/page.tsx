import { CandyLink } from "@/components/CandyButton";
import Reveal from "@/components/Reveal";
import GameCard from "@/components/GameCard";
import GamesMarquee from "@/components/GamesMarquee";
import LiveCount from "@/components/LiveCount";
import PaymentStrip from "@/components/PaymentStrip";
import WinnerMarquee from "@/components/WinnerMarquee";
import JackpotTicker from "@/components/JackpotTicker";
import FortuneWheel from "@/components/FortuneWheel";
import { GAMES, PROMOS } from "@/lib/data";
import { iconMap } from "@/lib/iconMap";
import { Ticket, Gift, Zap, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STEPS = [
  { icon: Ticket, title: "Grab Your Pass", text: "Sign up in 30 seconds â€” no fuss, just the floor.", color: "#ff2e9a" },
  { icon: Gift, title: "Claim 100% Bonus", text: "Your first deposit gets doubled. Walk in loaded.", color: "#b056ff" },
  { icon: Zap, title: "Play & Cash Out", text: "Spin, deal, crash â€” payouts hit in 3 minutes flat.", color: "#aaff3c" },
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
      <section className="relative px-4 pt-3 sm:pt-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display font-semibold text-ink">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-lime" />
              Premium Sweepstakes Casino
            </span>

            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-ink">Feel the rush at</span>
              <span className="block shine-text">JuwaFire</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Tap any game to play instantly. No downloads, no waiting â€” fund your wallet,
              jump straight in, and cash out your winnings in minutes.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CandyLink href="/promotions" variant="primary" size="lg">
                <Gift className="h-5 w-5" /> Claim 100% Bonus
              </CandyLink>
              <CandyLink href="/games" variant="ghost" size="lg">
                Enter the Games
              </CandyLink>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-ink-soft">
              <div className="flex -space-x-2">
                {["#ff2e9a", "#b056ff", "#aaff3c", "#2de2ff"].map((c) => (
                  <span
                    key={c}
                    className="h-7 w-7 rounded-full border-2 border-bg"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <strong className="text-ink">4.9/5</strong> from 60k+ players
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HOTTEST GAMES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Hottest <span className="text-magenta">Games</span>
            </h2>
            <Link href="/games" className="font-display font-bold text-magenta hover:text-cyan">
              See all â†’
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

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HOW IT WORKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Three steps to the <span className="text-magenta">rush</span>
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-5 md:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative min-w-0 text-center md:flex md:items-start md:gap-3 md:text-left">
                  <span
                    className="mx-auto grid h-10 w-10 place-items-center rounded-xl text-white shadow-[0_0_22px_rgba(255,46,154,0.35)] md:mx-0 md:h-12 md:w-12 md:shrink-0 md:rounded-2xl"
                    style={{ background: s.color, boxShadow: `0 0 22px ${s.color}77` }}
                  >
                    <s.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </span>
                  <span className="mt-2 block min-w-0 md:mt-0">
                    <p className="font-display text-[10px] font-bold uppercase tracking-wide text-ink-soft sm:text-xs">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-0.5 text-balance font-display text-sm font-bold leading-tight text-ink sm:text-base md:text-lg">
                      {s.title}
                    </h3>
                    <p className="mt-1 hidden text-sm leading-5 text-ink-soft sm:block">{s.text}</p>
                  </span>
                  {i < STEPS.length - 1 ? (
                    <span className="pointer-events-none absolute left-[calc(100%+0.25rem)] top-5 hidden h-px w-6 bg-gradient-to-r from-white/30 to-transparent md:block" />
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ WHEEL + PROMOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="candy-card rounded-[2rem] p-8">
              <h2 className="text-center font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Spin the <span className="text-violet">Wheel of Wow</span>
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-center text-ink-soft">
                One free spin every day. Cash, spins, boosts and the odd jackpot. Give it a whirl.
              </p>
              <div className="mt-8">
                <FortuneWheel />
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Tonight&apos;s <span className="text-gold">drops</span>
              </h2>
            </Reveal>
            {PROMOS.slice(0, 3).map((p, i) => {
              const Icon = iconMap[p.icon];
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <Link
                    href="/promotions"
                    className="candy-card flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-1"
                  >
                    <span
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white"
                      style={{ background: `linear-gradient(150deg, ${p.from}, ${p.to})`, boxShadow: `0 0 28px ${p.from}66` }}
                    >
                      <Icon className="h-8 w-8" />
                    </span>
                    <div>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                        style={{ background: p.from }}
                      >
                        {p.badge}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-bold text-ink">{p.title}</h3>
                      <p className="text-sm text-ink-soft">{p.blurb}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
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
                  <ShieldCheck className="h-4 w-4 text-lime" /> Licensed &amp; Fair
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
                the wheel is spinning â€” all that&apos;s missing is you.
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



