"use server";

import { revalidatePath } from "next/cache";
import { and, eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, users } from "@juwafire/db";
import { requireAdmin } from "@/lib/guard";
import { writeAudit } from "@/lib/audit";

export async function createStaff(formData: FormData) {
  const me = await requireAdmin();
  const username = String(formData.get("username") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  if (username.length < 3 || password.length < 6) return;

  const existing = await db.query.users.findFirst({ where: eq(users.username, username) });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  const [u] = await db
    .insert(users)
    .values({ username, name: username, passwordHash, role: "staff" })
    .returning();
  await writeAudit(me.id, "staff.create", "user", u.id, `created staff ${username}`);
  revalidatePath("/staff");
}

export async function revokeStaff(id: string) {
  const me = await requireAdmin();
  if (id === me.id) return; // don't demote yourself
  await db.update(users).set({ role: "player" }).where(and(eq(users.id, id), or(eq(users.role, "staff"), eq(users.role, "admin"))));
  await writeAudit(me.id, "staff.revoke", "user", id);
  revalidatePath("/staff");
}
