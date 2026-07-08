"use client";

import { Bell } from "lucide-react";
import { toast } from "@/lib/toast";

/** Notification bell. No notification feed yet — friendly no-op for now. */
export default function NotifBell() {
  return (
    <button
      type="button"
      onClick={() => toast("You're all caught up — no new notifications.", "info")}
      aria-label="Notifications"
      className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-white/10"
    >
      <Bell className="h-5 w-5" />
    </button>
  );
}
