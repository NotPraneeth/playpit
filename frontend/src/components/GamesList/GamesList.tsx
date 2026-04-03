import GameCard from '../GameCard/GameCard'

type Game = {
    id: string
    title: string
    creator_name?: string
}

export default function GamesList({ games }: { games: Game[] }) {
    return (
        <div className="flex flex-wrap gap-5">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    )
}