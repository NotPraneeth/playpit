'use client'

import { useState } from 'react'
import { useEffect } from 'react'

import { uploadGame } from '@/lib/api/uploadGame'

export default function UploadPage() {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [buildFile, setBuildFile] = useState<File | null>(null)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('access_token')

        if (!token) {
            window.location.href = '/auth'
        } else {
            setPageLoading(false)
        }

    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!buildFile) {
            alert('Build file required')
            return
        }

        try {
            setLoading(true)

            const gameId = await uploadGame({
                title,
                description,
                buildFile,
                thumbnailFile: thumbnailFile || undefined,
            })

            alert('Uploaded! ' + gameId)
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }
    if (pageLoading) return null
    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full"
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
            />

            <input
                type="file"
                onChange={(e) => setBuildFile(e.target.files?.[0] || null)}
            />

            <input
                type="file"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2"
            >
                {loading ? 'Uploading...' : 'Upload Game'}
            </button>
        </form>
    )
}