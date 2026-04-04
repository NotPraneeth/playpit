import { Hono } from 'hono'
import { getSupabaseClient } from '../lib/supabase'
import type { BaseContext } from '../types'

export const games = new Hono<BaseContext>()

games.post('/create', async (c) => {
    const token = c.get('token')
    const supabase = getSupabaseClient(c.env, token)

    const { title, description } = await c.req.json()

    const user = c.get('user')

    const { data, error } = await supabase
        .from('games')
        .insert({
            title,
            description,
            creator_id: user.id,
            status: 'draft'
        })
        .select()
        .single()

    if (error) return c.json({ error: error.message }, 500)

    return c.json({ game: data }, 200)
})

games.get('/', async (c) => {
    try {
        const supabase = getSupabaseClient(c.env)

        const { data, error } = await supabase
            .from('games')
            .select('*')

        if (error) {
            console.error('Supabase error:', error)
            return c.json({ error: error.message }, 500)
        }

        return c.json(data, 200)

    } catch (err) {
        console.error('Unexpected error:', err)
        return c.json({ error: 'Failed to fetch games' }, 500)
    }
})

games.get('/:id', async (c) => {
    try {
        const id = c.req.param('id')

        if (!id) {
            return c.json({ error: 'Missing game id' }, 400)
        }

        const token = c.get('token')
        const supabase = getSupabaseClient(c.env, token)

        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) {
            return c.json({ error: 'Game not found' }, 404)
        }

        return c.json({ game: data })
    } catch (err) {
        return c.json({ error: 'Failed to fetch game' }, 500)
    }
})

games.get('/:id/builds', async (c) => {
    try {
        const gameId = c.req.param('id')

        if (!gameId) {
            return c.json({ error: 'Missing game id' }, 400)
        }

        const token = c.get('token')
        const supabase = getSupabaseClient(c.env, token)

        const { data, error } = await supabase
            .from('game_builds')
            .select('*')
            .eq('game_id', gameId)

        if (error) {
            console.error('Supabase error:', error)
            return c.json({ error: error.message }, 500)
        }

        return c.json({ builds: data }, 200)

    } catch (err) {
        console.error('Unexpected error:', err)
        return c.json({ error: 'Failed to fetch builds' }, 500)
    }
})


games.post('/finalize', async (c) => {
    try {
        const { gameId, build, thumbnail } = await c.req.json()

        if (!gameId || !build) {
            return c.json({ error: 'Missing required fields' }, 400)
        }

        const user = c.get('user')
        const token = c.get('token')
        const supabase = getSupabaseClient(c.env, token)

        // ownership check
        const { data: game } = await supabase
            .from('games')
            .select('creator_id')
            .eq('id', gameId)
            .single()

        if (!game || game.creator_id !== user.id) {
            return c.json({ error: 'Not allowed' }, 403)
        }

        // 🔹 insert build
        const { error: buildError } = await supabase
            .from('game_builds')
            .insert({
                game_id: gameId,
                file_path: build.filePath,
                platform: build.platform,
                version: 'v1',
            })

        if (buildError) {
            return c.json({ error: buildError.message }, 500)
        }

        // 🔹 update game
        const updateData: any = {
            status: 'published',
        }

        if (thumbnail) {
            updateData.thumbnail = thumbnail
        }

        const { error: gameError } = await supabase
            .from('games')
            .update(updateData)
            .eq('id', gameId)

        if (buildError) {
            console.error('BUILD ERROR:', buildError)
            return c.json({ error: (buildError as any).message }, 500)
        }

        if (gameError) {
            console.error('GAME ERROR:', gameError)
            return c.json({ error: (gameError as any).message }, 500)
        }

        return c.json({ success: true })
    } catch (err) {
        console.error('FINALIZE ERROR:', err)
        return c.json({ error: 'Finalize failed', details: err }, 500)
    }
})