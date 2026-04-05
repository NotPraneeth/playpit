import GameCard from '../GameCard/GameCard'

type Game = {
    id: string
    title: string
    creator_name?: string
    thumbnail?: string
}

export default function GamesList({ games }: { games: Game[] }) {
    return (
        <div className="flex flex-wrap">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    )
}