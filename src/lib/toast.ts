export type ToastType = "success" | "error" | "info" | "win";

export type ToastDetail = { id: number; message: string; type: ToastType };

/** Fire a toast from anywhere on the client. Adds a tiny haptic on success. */
export function toast(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") return;
  if ((type === "success" || type === "win") && "vibrate" in navigator) {
    try {
      navigator.vibrate(12);
    } catch {
      /* ignore */
    }
  }
  const detail: ToastDetail = { id: Date.now() + Math.random(), message, type };
  window.dispatchEvent(new CustomEvent("juwa:toast", { detail }));
}
