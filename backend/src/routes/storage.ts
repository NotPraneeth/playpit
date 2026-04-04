import { Hono } from 'hono'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getS3 } from '../lib/r2'
import { getSupabaseClient } from '../lib/supabase'
import type { StorageContext } from '../types'

export const storage = new Hono<StorageContext>()

// 🔹 1. Generate upload URL
storage.post('/upload-urls', async (c) => {
    try {
        const { gameId, files } = await c.req.json()

        if (!gameId || !files) {
            return c.json({ error: 'Missing fields' }, 400)
        }

        const user = c.get('user')
        const token = c.get('token')
        const supabase = getSupabaseClient(c.env, token)

        // ownership check
        const { data: game } = await supabase
            .from('games')
            .select('id, creator_id')
            .eq('id', gameId)
            .single()

        if (!game || game.creator_id !== user.id) {
            return c.json({ error: 'Not allowed' }, 403)
        }

        const s3 = getS3(c.env)
        const response: any = {}

        // 🔹 BUILD
        if (files.build) {
            const { fileName, platform } = files.build

            if (!platform || !['windows', 'mac', 'linux'].includes(platform)) {
                return c.json({ error: 'Invalid platform' }, 400)
            }

            const key = `games/${gameId}/builds/${platform}/${Date.now()}-${fileName}`

            const command = new PutObjectCommand({
                Bucket: 'pitch-games',
                Key: key,
                ContentType: 'application/octet-stream',
            })

            const url = await getSignedUrl(s3, command, { expiresIn: 60 })

            response.build = { uploadUrl: url, key }
        }

        // 🔹 THUMBNAIL
        if (files.thumbnail) {
            const { fileName } = files.thumbnail

            if (!fileName.match(/\.(png|jpg|jpeg|webp)$/)) {
                return c.json({ error: 'Invalid image type' }, 400)
            }

            const key = `games/${gameId}/thumbnail/${Date.now()}-${fileName}`

            const command = new PutObjectCommand({
                Bucket: 'pitch-games',
                Key: key,
                ContentType: 'image/*',
            })

            const url = await getSignedUrl(s3, command, { expiresIn: 60 })

            response.thumbnail = { uploadUrl: url, key }
        }

        return c.json(response)
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Failed to generate upload URLs' }, 500)
    }
})



// 🔹 3. Dynamic download
storage.get('/download', async (c) => {
    try {
        const gameId = c.req.query('gameId')
        const platform = c.req.query('platform')

        if (!gameId || !platform) {
            return c.json({ error: 'Missing query params' }, 400)
        }

        const token = c.get('token')
        const supabase = getSupabaseClient(c.env, token)

        // 🔥 get latest build for platform
        const { data, error } = await supabase
            .from('game_builds')
            .select('*')
            .eq('game_id', gameId)
            .eq('platform', platform)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !data) {
            return c.json({ error: 'Build not found' }, 404)
        }

        const s3 = getS3(c.env)

        const command = new GetObjectCommand({
            Bucket: 'pitch-games',
            Key: data.file_path,
        })

        const url = await getSignedUrl(s3, command, { expiresIn: 60 })

        return c.json({ url })
    } catch (err) {
        return c.json({ error: 'Download failed' }, 500)
    }
})

