import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, users } from "@juwafire/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      async authorize(creds) {
        const username = String(creds?.username ?? "").toLowerCase().trim();
        const password = String(creds?.password ?? "");
        if (!username || !password) return null;

        const user = await db.query.users.findFirst({ where: eq(users.username, username) });
        if (!user?.passwordHash) return null;
        if (user.role !== "admin" && user.role !== "staff") return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? user.username,
          email: user.email,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; role?: string; username?: string | null };
        token.id = u.id;
        token.role = u.role ?? "staff";
        token.username = u.username ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const s = session.user as { id?: string; role?: string; username?: string | null };
        s.id = token.id as string;
        s.role = token.role as string;
        s.username = (token.username as string | null) ?? null;
      }
      return session;
    },
  },
});
