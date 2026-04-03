import GameCard from '../GameCard/GameCard'

type Game = {
    id: string
    title: string
    thumbnail: string
    creator_name?: string
}

export default function GamesList({ games }: { games: Game[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    )
}