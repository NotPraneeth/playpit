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


  // const games = [
  //   {
  //     "id": "842d5cfd-9901-4043-8100-a62e245f54ec",
  //     "title": "My first Game",
  //     "description": "This is a test game",
  //     "creator_id": "9fc2adb1-6189-46f6-b84e-8037da2a5c72",
  //     "created_at": "2026-04-03T19:04:49.417291"
  //   },
  //   {
  //     "id": "7388af26-3727-4ea7-91d5-8609f4562cfb",
  //     "title": "My second Game",
  //     "description": "This is a test game",
  //     "creator_id": "9fc2adb1-6189-46f6-b84e-8037da2a5c72",
  //     "created_at": "2026-04-03T19:04:56.43656"
  //   },
  //   {
  //     "id": "cc353acf-3046-4511-b685-852ebacc5e52",
  //     "title": "My third Game",
  //     "description": "This is a test game",
  //     "creator_id": "9fc2adb1-6189-46f6-b84e-8037da2a5c72",
  //     "created_at": "2026-04-03T19:05:00.782905"
  //   },
  //   {
  //     "id": "cc353acf-3046-4511-b685-852ebacc5e52",
  //     "title": "My third Game",
  //     "description": "This is a test game",
  //     "creator_id": "9fc2adb1-6189-46f6-b84e-8037da2a5c72",
  //     "created_at": "2026-04-03T19:05:00.782905"
  //   },
  //   {
  //     "id": "cc353acf-3046-4511-b685-852ebacc5e52",
  //     "title": "My third Game",
  //     "description": "This is a test game",
  //     "creator_id": "9fc2adb1-6189-46f6-b84e-8037da2a5c72",
  //     "created_at": "2026-04-03T19:05:00.782905"
  //   }
  // ]

  return (
    <>
      <div className="flex gap-10">
        <FilterGames />
        <GamesList games={games} />
      </div>
    </>
  );
}
