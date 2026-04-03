import FilterGames from "@/components/FilterGames/FilterGames";
import GamesList from "@/components/GamesList/GamesList";

export default async function Home() {

  const res = await fetch('http://localhost:8787/games', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch games');
  }

  const games = await res.json();

  return (
    <>
      <div className="flex gap-10">
        <FilterGames />
        <GamesList games={games} />
      </div>
    </>
  );
}
