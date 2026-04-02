import { Hono } from 'hono'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getS3 } from '../lib/r2'
import { getSupabaseClient } from '../lib/supabase'

export const storage = new Hono<{
    Bindings: {
        R2_ACCESS_KEY: string
        R2_SECRET_KEY: string
        R2_ACCOUNT_ID: string
        SUPABASE_URL: string
        SUPABASE_ANON_KEY: string
    }
}>()

// 🔹 1. Generate upload URL
storage.post('/upload-url', async (c) => {
    try {
        const { gameId, fileName, platform } = await c.req.json()

        if (!gameId || !fileName || !platform) {
            return c.json({ error: 'Missing fields' }, 400)
        }

        const s3 = getS3(c.env)

        const key = `games/${gameId}/builds/${Date.now()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: 'pitch-games',
            Key: key,
        })

        const url = await getSignedUrl(s3, command, { expiresIn: 60 })

        return c.json({ url, key })
    } catch (err) {
        return c.json({ error: 'Failed to generate upload URL' }, 500)
    }
})


// 🔹 2. Save build to DB
storage.post('/save-build', async (c) => {
    try {
        const { gameId, fileName, filePath, platform } = await c.req.json()

        const supabase = getSupabaseClient(c.env)

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

        const supabase = getSupabaseClient(c.env)

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