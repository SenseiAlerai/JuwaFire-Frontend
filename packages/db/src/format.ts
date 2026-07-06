/** Client-safe money helpers (no DB/server imports). */
export const formatUSD = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
export const toCents = (dollars: number) => Math.round(dollars * 100);
export const fromCents = (cents: number) => cents / 100;
