import { Hono } from 'hono'
import { getSupabaseClient } from '../lib/supabase'

export const games = new Hono<{
    Bindings: {
        SUPABASE_URL: string
        SUPABASE_ANON_KEY: string
    }
    Variables: {
        user: {
            id: string
            email: string
            user_metadata: {
                username: string
            }
        }
    }
}>()

games.post('/create', async (c) => {
    const { title, description } = await c.req.json()
    const supabase = getSupabaseClient(c.env)

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
    const supabase = getSupabaseClient(c.env)

    const { data, error } = await supabase
        .from('games')
        .select('*')

    if (error) return c.json({ error: error.message }, 500)

    return c.json({ games: data })
})

games.get('/:id', async (c) => {
    try {
        const id = c.req.param('id')

        if (!id) {
            return c.json({ error: 'Missing game id' }, 400)
        }

        const supabase = getSupabaseClient(c.env)

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
    const gameId = c.req.param('id')

    const supabase = getSupabaseClient(c.env)

    const { data, error } = await supabase
        .from('game_builds')
        .select('*')
        .eq('game_id', gameId)

    if (error) return c.json({ error: error.message }, 500)

    return c.json({ builds: data })
})