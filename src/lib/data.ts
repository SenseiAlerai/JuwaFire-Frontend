import type { IconName } from "./iconMap";

// Shared content for JuwaFire. Game platforms mirror the real sweepstakes apps.

export type GameCat = "Slots" | "Fish";

export type GameBadge = { label: string; color: string };

export type Game = {
  name: string;
  subtitle: string;
  category: GameCat;
  badge?: GameBadge;
  image: string; // /games/game-*.png
  url: string; // external platform launch URL
  accent: string; // neon glow color
};

const POPULAR: GameBadge = { label: "Popular", color: "#ff2e9a" };
const HOT: GameBadge = { label: "Hot", color: "#ff3b5c" };
const TRENDING: GameBadge = { label: "Trending", color: "#2de2ff" };
const NEW: GameBadge = { label: "New", color: "#aaff3c" };

export const GAMES: Game[] = [
  { name: "Juwa", subtitle: "Dragon Fortune", category: "Slots", badge: POPULAR, image: "/games/game-juwa.png", url: "http://dl.juwa777.com/", accent: "#ff2e9a" },
  { name: "Golden Dragon", subtitle: "Blazing Riches", category: "Fish", badge: HOT, image: "/games/game-goldendragon.jpg", url: "https://playgd.mobi/", accent: "#ffc63d" },
  { name: "Fire Kirin", subtitle: "Blazing Tables", category: "Fish", badge: HOT, image: "/games/game-firekirin.jpg", url: "https://firekirin.com/", accent: "#ff3b5c" },
  { name: "Orion Stars", subtitle: "Cosmic Spins", category: "Slots", badge: TRENDING, image: "/games/game-orionstars.jpg", url: "http://www.orionstarsonline.com/", accent: "#2de2ff" },
  { name: "Game Vault", subtitle: "Golden Rewards", category: "Slots", badge: NEW, image: "/games/game-gamevault.jpg", url: "https://download.gamevault999.com/", accent: "#ffc63d" },
  { name: "Mafia", subtitle: "Aces High", category: "Slots", badge: NEW, image: "/games/game-mafia.jpg", url: "https://mafia77777.com/", accent: "#d4af37" },
  { name: "Panda Master", subtitle: "Master Wins", category: "Fish", badge: TRENDING, image: "/games/game-pandamaster.png", url: "https://pandamaster.com/", accent: "#34d399" },
  { name: "Milkyway", subtitle: "Galaxy Spins", category: "Slots", image: "/games/game-milkyway.jpg", url: "https://milkywayapp.xyz/", accent: "#b056ff" },
  { name: "Ultra Panda", subtitle: "Fortune Panda", category: "Fish", badge: HOT, image: "/games/game-ultrapanda.png", url: "http://www.ultrapanda.mobi/", accent: "#aaff3c" },
  { name: "Cash Frenzy", subtitle: "Bonus Rush", category: "Slots", image: "/games/game-cashfrenzy.png", url: "https://www.cashfrenzy777.com/m", accent: "#ff7a2f" },
  { name: "Vblink", subtitle: "Neon Spins", category: "Slots", badge: NEW, image: "/games/game-vblink.png", url: "https://www.vblink777.com/", accent: "#2de2ff" },
  { name: "Cash Machine", subtitle: "Money Reels", category: "Slots", image: "/games/game-cashmachine.jpg", url: "http://www.cashmachine777.com/", accent: "#ffc63d" },
  { name: "Joker777", subtitle: "Wild Cards", category: "Slots", badge: NEW, image: "/games/game-joker777.png", url: "https://www.joker777.win/", accent: "#ff2e9a" },
  { name: "Gameroom", subtitle: "VIP Lounge", category: "Slots", image: "/games/game-gameroom.jpg", url: "https://www.gameroom777.com/", accent: "#2de2ff" },
  { name: "MR.Allinone", subtitle: "All-In Action", category: "Fish", image: "/games/game-mrallinone.jpg", url: "http://www.mrallinone777.com/", accent: "#b056ff" },
];

export const CATEGORIES = ["All", "Slots", "Fish"] as const;

export type Promo = {
  title: string;
  blurb: string;
  badge: string;
  cta: string;
  from: string;
  to: string;
  icon: IconName;
  href?: string;
};

export const PROMOS: Promo[] = [
  {
    title: "100% Welcome Rush",
    blurb: "Double your first deposit up to $1,500 plus 200 free spins to get started.",
    badge: "NEW PLAYERS",
    cta: "Claim Welcome",
    from: "#ff2e9a",
    to: "#b056ff",
    icon: "gift",
  },
  {
    title: "Wheel of Wow",
    blurb: "Spin the neon wheel every single day for free cash, spins and mystery boxes.",
    badge: "DAILY",
    cta: "Spin Now",
    from: "#b056ff",
    to: "#2de2ff",
    icon: "wheel",
  },
  {
    title: "Cashback Surge",
    blurb: "Get up to 25% back every Monday — because every player deserves a comeback.",
    badge: "WEEKLY",
    cta: "Opt In",
    from: "#aaff3c",
    to: "#2de2ff",
    icon: "coins",
  },
  {
    title: "Refer & Earn",
    blurb: "Bring a friend and you both pocket a $10 bonus once they play. Everybody wins.",
    badge: "FRIENDS",
    cta: "Get Link",
    from: "#ff3b5c",
    to: "#ffc63d",
    icon: "sparkles",
    href: "/refer",
  },
];

export type VipTier = {
  name: string;
  perk: string;
  cashback: string;
  color: string;
  icon: IconName;
  minDepositCents: number; // lifetime deposits needed to reach this tier
  dailyCashoutCents: number; // max cashout per day at this tier
};

export const VIP_TIERS: VipTier[] = [
  { name: "Bronze", perk: "Daily free spins", cashback: "5%", color: "#cd7f32", icon: "flame", minDepositCents: 0, dailyCashoutCents: 40000 },
  { name: "Silver", perk: "Weekly bonus box", cashback: "8%", color: "#9fb3c8", icon: "sparkles", minDepositCents: 10000, dailyCashoutCents: 55000 },
  { name: "Gold", perk: "Priority support", cashback: "12%", color: "#ffc63d", icon: "coins", minDepositCents: 50000, dailyCashoutCents: 70000 },
  { name: "Platinum", perk: "Faster payouts", cashback: "15%", color: "#7c9cff", icon: "crown", minDepositCents: 150000, dailyCashoutCents: 85000 },
  { name: "Diamond", perk: "Personal host + top cashback", cashback: "20%", color: "#67e8f9", icon: "gem", minDepositCents: 500000, dailyCashoutCents: 100000 },
];

/* ────────────────────────────────────────────────────────────
   Cashout rules — min/max redeem by load amount.
   ──────────────────────────────────────────────────────────── */
export const CASHOUT_RULES = [
  { load: "$5 – $9", min: "$50", max: "$50" },
  { load: "$10 – $14", min: "$50", max: "10× deposit" },
  { load: "$15 – $19", min: "$60", max: "10× deposit" },
  { load: "$20 – $24", min: "$70", max: "10× deposit" },
  { load: "$25 – $29", min: "$80", max: "10× deposit" },
  { load: "$30 – $34", min: "$90", max: "10× deposit" },
  { load: "$35 – $39", min: "$100", max: "10× deposit" },
  { load: "$40 – $49", min: "3× deposit", max: "10× deposit" },
  { load: "$50 & above (High Roller)", min: "4× deposit", max: "10× deposit" },
];

export const CASHOUT_NOTES = [
  "Cashout is based on your last deposit — your last load to a game. Bonuses are not included.",
  "You must cash out or play your deposit within 24 hours, or it will be voided.",
  "You must cash out your entire balance (including your safe) to start a redeem.",
  "Your account must be cleared to zero before you can reload.",
  "Credits above your maximum cashout are voided — only the maximum is paid.",
  "Transferring credits between accounts is not allowed.",
  "Free play, daily wheel and piggy-bank bonuses are not calculated with your last deposit when redeeming.",
  "We are not responsible for game glitches or crashes.",
];

export const WINNERS = [
  { name: "Mia****", game: "Fire Kirin", amount: "12,480 SC" },
  { name: "Leo****", game: "Juwa", amount: "3,210 SC" },
  { name: "Ava****", game: "Orion Stars", amount: "8,750 SC" },
  { name: "Noa****", game: "Panda Master", amount: "5,120 SC" },
  { name: "Zoe****", game: "Game Vault", amount: "2,090 SC" },
  { name: "Eli****", game: "Milkyway", amount: "6,640 SC" },
  { name: "Ivy****", game: "Cash Frenzy", amount: "1,870 SC" },
  { name: "Max****", game: "Ultra Panda", amount: "9,300 SC" },
];



