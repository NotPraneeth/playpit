import { Hono } from 'hono'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getS3 } from '../lib/r2'
import { getSupabaseClient } from '../lib/supabase'
import type { StorageContext } from '../types'

export const storage = new Hono<StorageContext>()

// 🔹 1. Generate upload URL
storage.post('/upload-url', async (c) => {
    try {
        const { gameId, fileName, type, platform } = await c.req.json()

        if (!gameId || !fileName || !type) {
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

        let key = ''
        let contentType = ''

        // handle thumbnail
        if (type === 'thumbnail') {
            if (!fileName.match(/\.(png|jpg|jpeg|webp)$/)) {
                return c.json({ error: 'Invalid image type' }, 400)
            }

            key = `games/${gameId}/thumbnail/${Date.now()}-${fileName}`
            contentType = 'image/*'
        }

        // handle build
        if (type === 'build') {
            if (!platform) {
                return c.json({ error: 'Platform required' }, 400)
            }

            if (!['windows', 'mac', 'linux'].includes(platform)) {
                return c.json({ error: 'Invalid platform' }, 400)
            }

            key = `games/${gameId}/builds/${platform}/${Date.now()}-${fileName}`
            contentType = 'application/octet-stream'
        }

        if (!key) {
            return c.json({ error: 'Invalid type' }, 400)
        }

        const s3 = getS3(c.env)

        const command = new PutObjectCommand({
            Bucket: 'pitch-games',
            Key: key,
            ContentType: contentType,
        })

        const url = await getSignedUrl(s3, command, { expiresIn: 60 })

        return c.json({ url, key })
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Failed to generate upload URL' }, 500)
    }
})


// 🔹 2. Save build to DB
storage.post('/save-build', async (c) => {
    try {
        const { gameId, fileName, filePath, platform } = await c.req.json()

        const token = c.get('token')
        const supabase = getSupabaseClient(c.env, token)

        const { error } = await supabase.from('game_builds').insert({
            game_id: gameId,
            file_name: fileName,
            file_path: filePath,
            platform,
            version: 'v1',
        })

        if (error) {
            return c.json({ error: error.message }, 500)
        }

        return c.json({ success: true })
    } catch (err) {
        return c.json({ error: 'Failed to save build' }, 500)
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