// Tiny synthesized sound engine (Web Audio) — no asset files, fully tasteful.
// Respects a persisted mute flag. Audio only starts after a user gesture
// (browser policy), which is fine since most sfx are tied to taps.

let ctx: AudioContext | null = null;
let muted = false;
let inited = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function initSound() {
  if (inited || typeof window === "undefined") return;
  inited = true;
  muted = localStorage.getItem("juwa-muted") === "1";
}

export function isMuted() {
  return muted;
}

export function setMuted(v: boolean) {
  muted = v;
  if (typeof window !== "undefined") localStorage.setItem("juwa-muted", v ? "1" : "0");
  if (!v) getCtx(); // unlock on unmute (counts as gesture)
}

/** Fully unlock audio inside a user gesture (esp. iOS). Safe to call repeatedly. */
export function unlockAudio() {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  try {
    const b = c.createBuffer(1, 1, 22050);
    const src = c.createBufferSource();
    src.buffer = b;
    src.connect(c.destination);
    src.start(0);
  } catch {
    /* ignore */
  }
}

type ToneOpts = {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  when?: number;
  slideTo?: number;
};

function tone({ freq, dur, type = "sine", gain = 0.14, when = 0, slideTo }: ToneOpts) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

export const sfxClick = () => tone({ freq: 520, dur: 0.06, type: "triangle", gain: 0.12 });
export const sfxTick = () => tone({ freq: 880, dur: 0.03, type: "square", gain: 0.08 });
export const sfxError = () => tone({ freq: 220, dur: 0.22, type: "sawtooth", gain: 0.12, slideTo: 110 });
export const sfxSpin = () => tone({ freq: 300, dur: 0.55, type: "sawtooth", gain: 0.1, slideTo: 880 });

export function sfxCoin() {
  tone({ freq: 660, dur: 0.08, type: "square", gain: 0.14 });
  tone({ freq: 990, dur: 0.1, type: "square", gain: 0.14, when: 0.06 });
}

export function sfxWin() {
  // bright C-E-G-C arpeggio
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
    tone({ freq: f, dur: 0.5, type: "triangle", gain: 0.16, when: i * 0.09 }),
  );
}
