import type { NextAuthConfig } from "next-auth";

/** Edge-safe base config (no DB imports) — used by middleware and shared with auth.ts. */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [],
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
} satisfies NextAuthConfig;
