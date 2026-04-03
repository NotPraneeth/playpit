import Link from 'next/link'

type Game = {
    id: string
    title: string
    creator_name?: string
    thumbnail?: string
}

export default function GameCard({ game }: { game: Game }) {
    const imageUrl = game.thumbnail
        ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${game.thumbnail}`
        : null
    console.log(game)
    console.log(imageUrl)
    return (
        <Link href={`/games/${game.id}`}>
            <div className="group cursor-pointer">

                {/* Thumbnail */}
                <div className="w-full h-40 bg-gray-200 rounded overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={game.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            No Image
                        </div>
                    )}
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