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
            creator_id: user.id
        })
        .select()
        .single()

    if (error) return c.json({ error: error.message }, 500)

    return c.json({ game: data }, 200)
})

games.get('/', async (c) => {
    try {
        const token = c.get('token')
        const supabase = getSupabaseClient(c.env, token)

        const { data, error } = await supabase
            .from('games')
            .select('*')

        if (error) {
            console.error('Supabase error:', error)
            return c.json({ error: error.message }, 500)
        }

        return c.json({ games: data }, 200)

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