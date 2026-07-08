import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or fewer")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  name: z.string().max(60).optional(),
  ref: z.string().max(40).optional(), // referrer's username, from ?ref= link
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const username = parsed.data.username.toLowerCase();
  const email = parsed.data.email ? parsed.data.email.toLowerCase() : null;

  // uniqueness check
  const existing = await db.query.users.findFirst({
    where: email
      ? or(eq(users.username, username), eq(users.email, email))
      : eq(users.username, username),
  });
  if (existing) {
    const clash = existing.username === username ? "Username" : "Email";
    return NextResponse.json({ error: `${clash} is already taken` }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  // Resolve the referral code (a username) to the referrer's id, if valid.
  let referredBy: string | null = null;
  const refCode = parsed.data.ref?.trim().toLowerCase();
  if (refCode && refCode !== username) {
    const referrer = await db.query.users.findFirst({ where: eq(users.username, refCode) });
    if (referrer) referredBy = referrer.id;
  }

  await db.insert(users).values({
    username,
    email,
    passwordHash,
    name: parsed.data.name?.trim() || parsed.data.username,
    role: "player",
    balanceCents: 0,
    referredBy,
  });

  return NextResponse.json({ ok: true });
}
