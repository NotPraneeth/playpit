import { Hono } from 'hono'
import { auth } from './routes/auth'
import { storage } from './routes/storage'
import { games } from './routes/games'

import { requireAuth } from './lib/middleware/requireAuth'

const app = new Hono<{ Bindings: { SUPABASE_URL: string; SUPABASE_ANON_KEY: string } }>()

// Health check
app.get('/', (c) => c.json({ status: 'ok' }))

// Middleware
app.use('/games/*', requireAuth)
app.use('/storage/*', requireAuth)

// Auth routes
app.route('/auth', auth)
app.route('/storage', storage)
app.route('/games', games)


export default app