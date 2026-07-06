import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type StaffUser = { id: string; role: string; username?: string | null; email?: string | null };

/** Require an authenticated admin or staff; redirect to login otherwise. */
export async function requireStaff(): Promise<StaffUser> {
  const session = await auth();
  const u = session?.user as StaffUser | undefined;
  if (!u?.id || (u.role !== "admin" && u.role !== "staff")) redirect("/login");
  return u;
}

/** Require full admin (e.g. staff management). */
export async function requireAdmin(): Promise<StaffUser> {
  const u = await requireStaff();
  if (u.role !== "admin") redirect("/");
  return u;
}
