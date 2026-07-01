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
  { name: "Fire Kirin", subtitle: "Blazing Tables", category: "Fish", badge: HOT, image: "/games/game-firekirin.png", url: "https://firekirin.com/", accent: "#ff3b5c" },
  { name: "Orion Stars", subtitle: "Cosmic Spins", category: "Slots", badge: TRENDING, image: "/games/game-orionstars.png", url: "http://www.orionstarsonline.com/", accent: "#2de2ff" },
  { name: "Game Vault", subtitle: "Golden Rewards", category: "Slots", badge: NEW, image: "/games/game-gamevault.png", url: "https://download.gamevault999.com/", accent: "#ffc63d" },
  { name: "Panda Master", subtitle: "Master Wins", category: "Fish", badge: TRENDING, image: "/games/game-pandamaster.png", url: "https://pandamaster.com/", accent: "#34d399" },
  { name: "Milkyway", subtitle: "Galaxy Spins", category: "Slots", image: "/games/game-milkyway.png", url: "https://milkywayapp.xyz/", accent: "#b056ff" },
  { name: "Ultra Panda", subtitle: "Fortune Panda", category: "Fish", badge: HOT, image: "/games/game-ultrapanda.png", url: "http://www.ultrapanda.mobi/", accent: "#aaff3c" },
  { name: "Cash Frenzy", subtitle: "Bonus Rush", category: "Slots", image: "/games/game-cashfrenzy.png", url: "https://www.cashfrenzy777.com/m", accent: "#ff7a2f" },
  { name: "Vblink", subtitle: "Neon Spins", category: "Slots", badge: NEW, image: "/games/game-vblink.png", url: "https://www.vblink777.com/", accent: "#2de2ff" },
  { name: "Cash Machine", subtitle: "Money Reels", category: "Slots", image: "/games/game-cashmachine.png", url: "http://www.cashmachine777.com/", accent: "#ffc63d" },
  { name: "Joker777", subtitle: "Wild Cards", category: "Slots", badge: NEW, image: "/games/game-joker777.png", url: "https://www.joker777.win/", accent: "#ff2e9a" },
  { name: "Gameroom", subtitle: "VIP Lounge", category: "Slots", image: "/games/game-gameroom.png", url: "https://www.gameroom777.com/", accent: "#2de2ff" },
  { name: "MR.Allinone", subtitle: "All-In Action", category: "Fish", image: "/games/game-mrallinone.png", url: "http://www.mrallinone777.com/", accent: "#b056ff" },
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
    blurb: "Get up to 25% back every Monday â€” because every player deserves a comeback.",
    badge: "WEEKLY",
    cta: "Opt In",
    from: "#aaff3c",
    to: "#2de2ff",
    icon: "coins",
  },
  {
    title: "Refer & Earn",
    blurb: "Bring a friend and you both pocket a $25 bonus once they play. Everybody wins.",
    badge: "FRIENDS",
    cta: "Get Link",
    from: "#ff3b5c",
    to: "#ffc63d",
    icon: "sparkles",
  },
];

export type VipTier = {
  name: string;
  perk: string;
  cashback: string;
  color: string;
  icon: IconName;
};

export const VIP_TIERS: VipTier[] = [
  { name: "Spark", perk: "Daily free spins", cashback: "5%", color: "#2de2ff", icon: "sparkles" },
  { name: "Voltage", perk: "Weekly bonus box", cashback: "8%", color: "#aaff3c", icon: "circle" },
  { name: "Neon", perk: "Personal host", cashback: "12%", color: "#b056ff", icon: "gem" },
  { name: "Electric", perk: "Faster payouts", cashback: "15%", color: "#ff2e9a", icon: "wheel" },
  { name: "Ringmaster", perk: "Cashback, no limits", cashback: "20%", color: "#ffc63d", icon: "crown" },
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



