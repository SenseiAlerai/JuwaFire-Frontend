"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { initSound, isMuted, setMuted, unlockAudio, sfxCoin } from "@/lib/sound";

/** Floating mute toggle. Also unlocks the audio context on the first gesture. */
export default function SoundToggle() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    initSound();
    setMutedState(isMuted());
    // Unlock audio on the very first interaction anywhere (esp. iOS).
    const onFirst = () => unlockAudio();
    window.addEventListener("pointerdown", onFirst, { once: true });
    window.addEventListener("keydown", onFirst, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
  }, []);

  function toggle() {
    unlockAudio();
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sfxCoin(); // audible confirmation when turning sound ON
  }

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      aria-pressed={!muted}
      className="fixed bottom-24 left-3 z-40 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/12 bg-[rgba(18,10,32,0.85)] text-ink-soft shadow-[0_8px_24px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:text-ink active:scale-90 md:bottom-6"
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 text-cyan" />}
    </button>
  );
}
