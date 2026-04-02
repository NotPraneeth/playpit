import { getSupabaseClient } from '../supabase'

export const requireAuth = async (c: any, next: any) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Missing or invalid token' }, 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = getSupabaseClient(c.env, token)

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }

    c.set('user', user)

    await next()
}