import { getRefreshToken, setTokens } from './auth'

export async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = getRefreshToken()
    const API_URL = process.env.NEXT_PUBLIC_API_URL!

    if (!refreshToken) return false

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) return false

    const data = await res.json()

    setTokens(data.access_token, data.refresh_token)

    return true
}