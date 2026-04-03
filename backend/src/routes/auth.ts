import { Hono } from 'hono'
import { getSupabaseClient } from '../lib/supabase'
import type { BaseContext } from '../types'

export const auth = new Hono<BaseContext>()

// POST /auth/register
auth.post('/register', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const { email } = await c.req.json()

  // Validate email format
  if (!email || !email.includes('@')) {
    return c.json({ error: 'Invalid email format' }, 400)
  }

  // Send OTP via Supabase
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true
    }
  })

  if (error) {
    return c.json({ error: error.message }, 400)
  }

  return c.json({ message: 'OTP sent to email' }, 200)
})

// POST /auth/register/verify
auth.post('/register/verify', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const { email, otp, password, username } = await c.req.json()

  // Validate all fields present
  if (!email || !otp || !password || !username) {
    return c.json({ error: 'All fields are required' }, 400)
  }

  // Verify OTP with Supabase
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email'
  })

  if (error) {
    return c.json({ error: 'Invalid or expired OTP' }, 400)
  }

  // Update the user with password and username
  const { error: updateError } = await supabase.auth.updateUser({
    password,
    data: { username }
  })

  if (updateError) {
    return c.json({ error: updateError.message }, 400)
  }

  return c.json({
    user_id: data.user?.id,
    username,
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token
  }, 200)
})

// POST /auth/login
auth.post('/login', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const { email, password } = await c.req.json()

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  return c.json({
    user_id: data.user.id,
    username: data.user.user_metadata.username,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  }, 200)
})

// POST /auth/logout
auth.post('/logout', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const { refresh_token } = await c.req.json()
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !refresh_token) {
    return c.json({ error: 'Missing token' }, 401)
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    return c.json({ error: error.message }, 400)
  }

  return c.json({ message: 'Logged out successfully' }, 200)
})

// POST /auth/refresh
auth.post('/refresh', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const { refresh_token } = await c.req.json()

  if (!refresh_token) {
    return c.json({ error: 'Refresh token is required' }, 400)
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token
  })

  if (error) {
    return c.json({ error: 'Invalid or expired refresh token' }, 401)
  }

  return c.json({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token
  }, 200)
})

// // POST /auth/password/forgot   === we dont have the reset password flow setup so this section will not work
// auth.post('/password/forgot', async (c) => {
//   const supabase = getSupabaseClient(c.env)
//   const { email } = await c.req.json()

//   if (!email) {
//     return c.json({ error: 'Email is required' }, 400)
//   }

//   await supabase.auth.resetPasswordForEmail(email)

//   // Always return success — never reveal if email exists
//   return c.json({ message: 'Password reset email sent' }, 200)
// })

// // POST /auth/password/reset
// auth.post('/password/reset', async (c) => {
//   const supabase = getSupabaseClient(c.env)
//   const { reset_token, new_password } = await c.req.json()

//   if (!reset_token || !new_password) {
//     return c.json({ error: 'All fields are required' }, 400)
//   }

//   const { error } = await supabase.auth.verifyOtp({
//     token_hash: reset_token,
//     type: 'recovery'
//   })

//   if (error) {
//     return c.json({ error: 'Invalid or expired reset token' }, 400)
//   }

//   const { error: updateError } = await supabase.auth.updateUser({
//     password: new_password
//   })

//   if (updateError) {
//     return c.json({ error: updateError.message }, 400)
//   }

//   return c.json({ message: 'Password reset successfully' }, 200)
// })

// // GET /auth/google
// auth.get('/google', async (c) => {
//   const supabase = getSupabaseClient(c.env)

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       redirectTo: 'http://localhost:3000/auth/callback',
//       skipBrowserRedirect: false
//     }
//   })

//   if (error || !data.url) {
//     return c.json({ error: 'Google authentication failed' }, 400)
//   }

//   return Response.redirect(data.url, 302)
// })

// // GET /auth/google/callback
// auth.get('/google/callback', async (c) => {
//   const code = c.req.query('code')

//   if (!code) {
//     return c.json({ error: 'Google authentication failed' }, 400)
//   }

//   const supabase = getSupabaseClient(c.env)

//   const { data, error } = await supabase.auth.exchangeCodeForSession(code)

//   if (error) {
//     return c.json({ error: 'Google authentication failed' }, 400)
//   }

//   const isNewUser = data.user.user_metadata.username === undefined

//   if (isNewUser) {
//     return c.json({
//       requires_username: true,
//       google_token: data.session.access_token
//     }, 200)
//   }

//   return c.json({
//     user_id: data.user.id,
//     username: data.user.user_metadata.username,
//     access_token: data.session.access_token,
//     refresh_token: data.session.refresh_token
//   }, 200)
// })

// // POST /auth/google/complete
// auth.post('/google/complete', async (c) => {
//   const { google_token, username } = await c.req.json()

//   if (!google_token || !username) {
//     return c.json({ error: 'All fields are required' }, 400)
//   }

//   const supabase = getSupabaseClient(c.env)

//   const { data: { user }, error: userError } = await supabase.auth.getUser(google_token)

//   if (userError || !user) {
//     return c.json({ error: 'Invalid or expired google_token' }, 400)
//   }

//   const { error: updateError } = await supabase.auth.updateUser({
//     data: { username }
//   })

//   if (updateError) {
//     return c.json({ error: updateError.message }, 400)
//   }

//   const { data: session, error: sessionError } = await supabase.auth.refreshSession()

//   if (sessionError) {
//     return c.json({ error: sessionError.message }, 400)
//   }

//   return c.json({
//     user_id: user.id,
//     username,
//     access_token: session.session?.access_token,
//     refresh_token: session.session?.refresh_token
//   }, 200)
// })

// GET /auth/me
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid token' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = getSupabaseClient(c.env, token)



  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  return c.json({
    user_id: user.id,
    username: user.user_metadata.username,
    email: user.email
  }, 200)
})