import Link from "next/link";
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Users, MessageCircle, UserCog, ScrollText,
} from "lucide-react";
import SignOutButton from "./SignOutButton";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/redeems", label: "Redeems", icon: ArrowDownCircle },
  { href: "/loads", label: "Loads", icon: ArrowUpCircle },
  { href: "/users", label: "Users", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/staff", label: "Staff", icon: UserCog },
  { href: "/audit", label: "Audit Log", icon: ScrollText },
];

type SessUser = { username?: string | null; email?: string | null; role?: string };

export default function Shell({
  title,
  user,
  children,
}: {
  title: string;
  user?: SessUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-line bg-panel p-4">
        <div className="mb-6 px-2 text-lg font-extrabold">
          JuwaFire <span className="text-brand">Admin</span>
        </div>
        <nav className="space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-line hover:text-ink"
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line px-6 py-3">
          <h1 className="text-lg font-bold">{title}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-ink-soft">
              {user?.username ?? user?.email} · <span className="text-brand">{user?.role}</span>
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
