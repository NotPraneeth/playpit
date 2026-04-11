import { getAuthHeader } from './auth'
import { tryRefreshToken } from './refreshToken'
import { handleLogout } from './logout'

export async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!

    const makeRequest = async () => {
        const authHeaders = getAuthHeader()

        return fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
                ...(options.headers || {}),
            },
        })
    }

    let res = await makeRequest()

    // 🔥 Handle expired token
    if (res.status === 401) {
        const refreshed = await tryRefreshToken()

        if (!refreshed) {
            handleLogout()
            throw new Error('Session expired')
        }

        // retry request with new token
        res = await makeRequest()
    }

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API Error: ${res.status} - ${text}`)
    }

    return res.json()
}