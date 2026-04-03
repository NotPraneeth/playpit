import FilterGames from "@/components/FilterGames/FilterGames";
import type { AppType } from "@backend/index"
import GamesList from "@/components/GamesList/GamesList";

export default function Home() {
  return (
    <>
      <FilterGames />
      {/* <GamesList games={games} /> */}
    </>
  );
}
