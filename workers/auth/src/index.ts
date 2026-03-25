import { Hono } from 'hono'
import { auth } from './routes/auth'

const app = new Hono<{ Bindings: { SUPABASE_URL: string; SUPABASE_ANON_KEY: string } }>()

// Health check
app.get('/', (c) => c.json({ status: 'ok' }))

// Auth routes
app.route('/auth', auth)

export default app