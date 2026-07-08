// VIP rank ladder — XP earned from play (1 coin / $1 played = 100 XP).
// Pure & client-safe (no db imports): used by the VIP page, dashboard bar, badge.

export type Rank = {
  name: string;
  color: string;
  stars: number;
  xpFloor: number; // min cumulative XP to sit at this rank
  xpNext: number; // "Next Level: X+" cumulative threshold; 0 = max rank
  levelUp: number; // one-time coin reward on reaching this rank
  withdraw: number; // withdrawal limit (display)
  platformWithdraw: number; // platform-games withdrawal limit (display)
  platformBonus: number; // platform-games bonus (display)
};

export const VIP_RANKS: Rank[] = [
  { name: "Iron",     color: "#8b95a5", stars: 1, xpFloor: 0,         xpNext: 100_000,    levelUp: 0,  withdraw: 300,   platformWithdraw: 300,   platformBonus: 0 },
  { name: "Bronze",   color: "#cd7f32", stars: 2, xpFloor: 100_000,   xpNext: 600_000,    levelUp: 2,  withdraw: 400,   platformWithdraw: 400,   platformBonus: 0 },
  { name: "Silver",   color: "#c3cad6", stars: 3, xpFloor: 600_000,   xpNext: 6_300_000,  levelUp: 2,  withdraw: 600,   platformWithdraw: 500,   platformBonus: 0 },
  { name: "Gold",     color: "#ffc63d", stars: 1, xpFloor: 6_300_000, xpNext: 8_000_000,  levelUp: 5,  withdraw: 1000,  platformWithdraw: 650,   platformBonus: 0 },
  { name: "Platinum", color: "#dfe4f2", stars: 2, xpFloor: 8_000_000, xpNext: 10_000_000, levelUp: 8,  withdraw: 1200,  platformWithdraw: 700,   platformBonus: 0 },
  { name: "Sapphire", color: "#3b82f6", stars: 1, xpFloor: 10_000_000, xpNext: 45_000_000, levelUp: 10, withdraw: 1700, platformWithdraw: 898,   platformBonus: 0 },
  { name: "Emerald",  color: "#22c55e", stars: 2, xpFloor: 45_000_000, xpNext: 0,          levelUp: 15, withdraw: 2000,  platformWithdraw: 1500,  platformBonus: 10 },
];

export function computeRank(xp: number) {
  const x = Math.max(0, xp || 0);
  let index = 0;
  for (let i = 0; i < VIP_RANKS.length; i++) {
    if (x >= VIP_RANKS[i].xpFloor) index = i;
  }
  const rank = VIP_RANKS[index];
  const isMax = index >= VIP_RANKS.length - 1;
  const next = isMax ? null : VIP_RANKS[index + 1];
  const span = Math.max(1, rank.xpNext - rank.xpFloor);
  const pct = isMax ? 100 : Math.min(100, Math.round(((x - rank.xpFloor) / span) * 100));
  const xpToNext = isMax ? 0 : Math.max(0, rank.xpNext - x);
  return { index, rank, next, isMax, pct, xpToNext };
}
