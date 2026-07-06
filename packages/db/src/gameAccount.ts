/** Helpers to mint game-platform credentials: {base}JF{random}. */

export function sanitizeBase(username?: string | null, email?: string | null): string {
  let base = (username || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!base && email) base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!base) base = "player";
  return base.slice(0, 12);
}

/** e.g. "alex" -> "alexJF4827" */
export function makeGameUsername(base: string): string {
  const rand = Math.floor(1000 + Math.random() * 9000); // 4 digits
  return `${base}JF${rand}`;
}

/** Readable auto-generated password (no ambiguous chars). */
export function makeGamePassword(len = 8): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let p = "";
  for (let i = 0; i < len; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}
