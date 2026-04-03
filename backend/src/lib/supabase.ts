import { createClient } from '@supabase/supabase-js'

export function getSupabaseClient(env: any, token?: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        apikey: env.SUPABASE_ANON_KEY
      }
    }
  })
}