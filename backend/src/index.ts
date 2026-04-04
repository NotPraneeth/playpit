import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './routes/auth'
import { storage } from './routes/storage'
import { games } from './routes/games'

import { requireAuth } from './lib/middleware/requireAuth'

import type { BaseContext } from './types'

const app = new Hono<BaseContext>()

app.use('*', cors({
    origin: 'http://localhost:3000',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Health check
app.get('/', (c) => c.json({ status: 'ok' }))

// Middleware
app.use('/games/create', requireAuth)
app.use('/games/finalize', requireAuth)
app.use('/storage/*', requireAuth)

// Auth routes
app.route('/auth', auth)
app.route('/storage', storage)
app.route('/games', games)

export type AppType = typeof app
export default app