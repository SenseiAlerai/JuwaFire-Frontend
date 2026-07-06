import { VIP_TIERS } from "./data";

/** Resolve a player's VIP standing from lifetime deposits (in cents). */
export function computeVip(lifetimeDepositCents: number) {
  let index = 0;
  for (let i = 0; i < VIP_TIERS.length; i++) {
    if (lifetimeDepositCents >= VIP_TIERS[i].minDepositCents) index = i;
  }
  const tier = VIP_TIERS[index];
  const isMax = index >= VIP_TIERS.length - 1;
  const nextTier = isMax ? null : VIP_TIERS[index + 1];

  const floor = tier.minDepositCents;
  const ceil = isMax ? lifetimeDepositCents : VIP_TIERS[index + 1].minDepositCents;
  const span = Math.max(1, ceil - floor);
  const pct = isMax ? 100 : Math.min(100, Math.round(((lifetimeDepositCents - floor) / span) * 100));
  const toGoCents = isMax ? 0 : Math.max(0, ceil - lifetimeDepositCents);

  return { index, tier, nextTier, isMax, pct, toGoCents };
}
