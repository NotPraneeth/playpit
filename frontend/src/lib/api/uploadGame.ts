import { apiFetch } from '../apifetch'

type UploadGameInput = {
    title: string
    description: string
    buildFile: File
    thumbnailFile?: File
    platform?: 'windows' | 'mac' | 'linux'
}

type CreateGameResponse = {
    game: { id: string }
}

type UploadUrlsResponse = {
    build: { uploadUrl: string; key: string }
    thumbnail?: { uploadUrl: string; key: string }
}

export async function uploadGame({
    title,
    description,
    buildFile,
    thumbnailFile,
    platform = 'windows',
}: UploadGameInput) {
    // 🟢 1. Create game
    const { game } = await apiFetch<CreateGameResponse>('/games/create', {
        method: 'POST',
        body: JSON.stringify({ title, description }),
    })

    const gameId = game.id

    // 🟡 2. Get upload URLs
    const { build, thumbnail } = await apiFetch<UploadUrlsResponse>(
        '/storage/upload-urls',
        {
            method: 'POST',
            body: JSON.stringify({
                gameId,
                files: {
                    build: {
                        fileName: buildFile.name,
                        platform,
                    },
                    ...(thumbnailFile && {
                        thumbnail: { fileName: thumbnailFile.name },
                    }),
                },
            }),
        }
    )

    // 🔵 3. Upload build
    const buildUpload = await fetch(build.uploadUrl, {
        method: 'PUT',
        body: buildFile,
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    })

    if (!buildUpload.ok) {
        throw new Error('Build upload failed')
    }

    // 🔵 Upload thumbnail (optional)
    if (thumbnail && thumbnailFile) {
        const thumbUpload = await fetch(thumbnail.uploadUrl, {
            method: 'PUT',
            body: thumbnailFile,
            headers: {
                'Content-Type': thumbnailFile.type,
            },
        })

        if (!thumbUpload.ok) {
            throw new Error('Thumbnail upload failed')
        }
    }

    // 🔴 4. Finalize
    await apiFetch('/games/finalize', {
        method: 'POST',
        body: JSON.stringify({
            gameId,
            build: {
                fileName: buildFile.name,
                filePath: build.key,
                platform,
            },
            thumbnail: thumbnail?.key,
        }),
    })

    return gameId
}