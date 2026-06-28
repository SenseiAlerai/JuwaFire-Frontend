"use client";

import { useEffect } from "react";
import { toast } from "@/lib/toast";
import { sfxWin } from "@/lib/sound";

// Simulated live floor activity — winners pop in periodically so the room
// always feels populated. Fabricated (like the static winner ticker).
const NAMES = [
  "Jordan M.", "Tasha R.", "Kevin P.", "Aaliyah B.", "Marcus T.", "Destiny W.",
  "Carlos G.", "Brianna L.", "Devin K.", "Sophia N.", "Tyler J.", "Imani S.",
  "Andre F.", "Chloe D.", "Malik H.", "Gabby V.",
];
const GAMESPOOL = [
  "Juwa", "Fire Kirin", "Orion Stars", "Game Vault", "Panda Master",
  "Milkyway", "Ultra Panda", "Cash Frenzy", "Joker777",
];

function rand<T>(a: T[]) {
  return a[Math.floor(Math.random() * a.length)];
}

export default function LiveActivity() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function fire() {
      const amount = (Math.floor(Math.random() * 95) + 5) * 100 + Math.floor(Math.random() * 90);
      const usd = amount.toLocaleString("en-US");
      toast(`${rand(NAMES)} won $${usd} on ${rand(GAMESPOOL)}`, "win");
      sfxWin();
      schedule();
    }

    function schedule() {
      // every ~16–34s
      timer = setTimeout(fire, 16000 + Math.random() * 18000);
    }

    // first pop a little sooner so the page feels alive on arrival
    timer = setTimeout(fire, 6000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
