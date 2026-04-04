import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin(env: any) {
    return createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SECRET_KEY
    )
}