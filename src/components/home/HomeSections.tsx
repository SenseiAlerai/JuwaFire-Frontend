"use client";

import CategoryPills from "./CategoryPills";
import GameShelf from "./GameShelf";
import { HOME_SECTIONS } from "@/lib/data";
import { useFavorites } from "@/lib/useFavorites";

export default function HomeSections() {
  const { favs, toggle } = useFavorites();
  return (
    <>
      <CategoryPills />
      {HOME_SECTIONS.map((s) => (
        <GameShelf key={s.key} section={s} favs={favs} onToggleFav={toggle} />
      ))}
    </>
  );
}
