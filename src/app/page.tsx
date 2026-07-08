import HeroCarousel from "@/components/home/HeroCarousel";
import RecentBigWins from "@/components/RecentBigWins";
import HomeSections from "@/components/home/HomeSections";

export default function Home() {
  return (
    <div className="pb-12">
      {/* hero banner carousel */}
      <div className="px-4 pt-4">
        <HeroCarousel />
      </div>

      {/* recent big wins ticker */}
      <div className="mx-auto mt-6 max-w-3xl px-4">
        <RecentBigWins />
      </div>

      {/* sticky search + category pills, then game shelves */}
      <div className="mt-4">
        <HomeSections />
      </div>
    </div>
  );
}
