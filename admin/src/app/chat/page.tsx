import Link from "next/link";
import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db, chatMessages, users } from "@juwafire/db";
import { requireStaff } from "@/lib/guard";
import Shell from "@/components/Shell";
import { Send } from "lucide-react";
import { replyChat } from "./actions";

export const dynamic = "force-dynamic";

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ u?: string }> }) {
  const me = await requireStaff();
  const { u: selected } = await searchParams;

  // conversation list
  const convos = await db
    .select({
      userId: chatMessages.userId,
      last: sql<string>`max(${chatMessages.createdAt})`,
      cnt: sql<number>`count(*)`,
    })
    .from(chatMessages)
    .groupBy(chatMessages.userId)
    .orderBy(desc(sql`max(${chatMessages.createdAt})`))
    .limit(100);

  const ids = convos.map((c) => c.userId);
  const nameRows = ids.length
    ? await db.select({ id: users.id, username: users.username, email: users.email }).from(users).where(inArray(users.id, ids))
    : [];
  const nameOf = new Map(nameRows.map((n) => [n.id, n.username ?? n.email ?? "player"]));

  // selected thread
  const thread = selected
    ? await db.select().from(chatMessages).where(eq(chatMessages.userId, selected)).orderBy(asc(chatMessages.createdAt)).limit(300)
    : [];

  return (
    <Shell title="Chat" user={me}>
      <div className="grid h-[calc(100vh-8rem)] grid-cols-[260px_1fr] gap-4">
        {/* conversation list */}
        <div className="card overflow-y-auto">
          {convos.length === 0 && <p className="p-4 text-sm text-ink-soft">No conversations yet.</p>}
          {convos.map((c) => (
            <Link
              key={c.userId}
              href={`/chat?u=${c.userId}`}
              className={`block border-b border-line/60 px-4 py-3 hover:bg-line ${selected === c.userId ? "bg-line" : ""}`}
            >
              <div className="font-semibold">{nameOf.get(c.userId)}</div>
              <div className="text-xs text-ink-soft">{c.cnt} msgs · {new Date(c.last).toLocaleString()}</div>
            </Link>
          ))}
        </div>

        {/* thread */}
        <div className="card flex flex-col">
          {!selected ? (
            <div className="grid flex-1 place-items-center text-ink-soft">Select a conversation</div>
          ) : (
            <>
              <div className="border-b border-line px-4 py-3 font-bold">{nameOf.get(selected) ?? "Player"}</div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {thread.map((m) => {
                  const admin = m.sender === "admin";
                  return (
                    <div key={m.id} className={`flex ${admin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${admin ? "bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white" : "bg-line text-ink"}`}>
                        {m.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`https://juwafire.com${m.imageUrl}`} alt="" className="mb-1 max-h-40 rounded-lg" />
                        )}
                        {m.body}
                        <div className={`mt-0.5 text-[10px] ${admin ? "text-white/60" : "text-ink-soft"}`}>{new Date(m.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form action={replyChat.bind(null, selected)} className="flex gap-2 border-t border-line p-3">
                <input name="body" placeholder="Reply…" autoComplete="off" className="flex-1 rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-brand" />
                <button className="btn bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] px-4 text-white"><Send className="h-4 w-4" /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
