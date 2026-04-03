import Link from 'next/link'

type Game = {
    id: string
    title: string
    creator_name?: string
}

export default function GameCard({ game }: { game: Game }) {
    return (
        <Link href={`/games/${game.id}`}>
            <div className="group cursor-pointer">

                {/* Thumbnail */}
                <div className="w-full h-40 bg-gray-200 rounded overflow-hidden">
                </div>

                {/* Info */}
                <div className="mt-2">
                    <h3 className="text-sm font-medium">
                        {game.title}
                    </h3>

                    {game.creator_name && (
                        <p className="text-xs text-gray-500">
                            {game.creator_name}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}