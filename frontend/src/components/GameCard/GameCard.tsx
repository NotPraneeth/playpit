import Link from 'next/link'
import Image from 'next/image'

type Game = {
    id: string
    title: string
    creator_name?: string
    description?: string
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
            <div className="group cursor-pointer min-h-68 w-60 p-2  bg-[var(--white)]  outline outline-2 outline-black text-black">

                {/* Thumbnail */}
                <div className="w-full h-40 bg-gray-200 p-5 overflow-hidden relative">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={game.title}
                            fill
                            className="w-full h-full aspect-[16/9] group-hover:scale-105 transition"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            No Image
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="mt-2 p-2  font-tertiary">
                    <h3 className="text-base uppercase font-semibold tracking-tight">
                        {game.title}
                    </h3>

                    {game.description && (
                        <p className="text-xs text-gray-500">
                            {game.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}