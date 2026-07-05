"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, ImagePlus, Loader2 } from "lucide-react";

type Msg = {
  id: string;
  sender: "user" | "admin";
  body?: string | null;
  imageUrl?: string | null;
  createdAt: string;
};

const POLL_MS = 2000;

export default function ChatWidget({ loggedIn = false }: { loggedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastTs = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const merge = useCallback((incoming: Msg[]) => {
    if (incoming.length === 0) return;
    setMsgs((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const next = [...prev, ...incoming.filter((m) => !seen.has(m.id))];
      const newest = next[next.length - 1]?.createdAt;
      if (newest) lastTs.current = newest;
      return next;
    });
  }, []);

  // initial load + polling while open
  useEffect(() => {
    if (!open || !loggedIn) return;
    let alive = true;

    async function load(after?: string) {
      const q = after ? `?after=${encodeURIComponent(after)}` : "";
      const res = await fetch(`/api/chat/messages${q}`, { cache: "no-store" });
      if (!res.ok || !alive) return;
      const data = await res.json();
      merge(data.messages as Msg[]);
    }

    load();
    const id = setInterval(() => load(lastTs.current ?? undefined), POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [open, loggedIn, merge]);

  // auto-scroll to newest
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, open]);

  async function sendText() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError(null);
    setText("");
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      merge([data.message as Msg]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
      setText(body);
    } finally {
      setSending(false);
    }
  }

  async function sendImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/chat/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error ?? "Upload failed");

      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: upData.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      merge([data.message as Msg]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open live chat"}
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white shadow-[0_10px_30px_-8px_rgba(255,46,154,0.9)] transition-transform hover:scale-105 active:scale-90 md:bottom-6 md:right-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-40 z-50 mx-auto flex h-[62vh] max-h-[560px] max-w-sm flex-col overflow-hidden rounded-3xl border border-white/12 bg-[rgba(10,12,26,0.98)] shadow-[0_30px_80px_-20px_rgba(176,86,255,0.5)] backdrop-blur-xl md:inset-x-auto md:right-6 md:bottom-24 md:w-96"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-ink">JuwaFire Support</p>
                <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Typically replies in minutes
                </p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-ink-soft hover:bg-white/10 hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>

            {!loggedIn ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="font-display font-bold text-ink">Log in to chat with us</p>
                <p className="text-sm text-ink-soft">Sign in and our team will help you out right here.</p>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] px-5 py-2.5 font-display font-bold text-white">
                  Log In
                </Link>
              </div>
            ) : (
              <>
                {/* messages */}
                <div ref={scrollRef} className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-3">
                  {msgs.length === 0 && (
                    <p className="mt-6 text-center text-sm text-ink-soft">
                      Send us a message — we&apos;re here to help with deposits, cashouts and games.
                    </p>
                  )}
                  {msgs.map((m) => {
                    const mine = m.sender === "user";
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                            mine
                              ? "rounded-br-md bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white"
                              : "rounded-bl-md bg-white/8 text-ink"
                          }`}
                        >
                          {m.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <a href={m.imageUrl} target="_blank" rel="noopener noreferrer">
                              <img src={m.imageUrl} alt="attachment" className="mb-1 max-h-48 rounded-lg object-cover" />
                            </a>
                          )}
                          {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {error && <p className="px-4 pb-1 text-xs text-red">{error}</p>}

                {/* composer */}
                <div className="flex items-center gap-2 border-t border-white/10 p-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) sendImage(f);
                    }}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    aria-label="Attach image"
                    className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink-soft transition-colors hover:bg-white/10 hover:text-ink disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                  </button>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendText();
                      }
                    }}
                    placeholder="Type a message…"
                    className="min-w-0 flex-1 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-magenta"
                  />
                  <button
                    onClick={sendText}
                    disabled={sending || !text.trim()}
                    aria-label="Send"
                    className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white transition-transform active:scale-90 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
