export function getAccessToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
}

export function getRefreshToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
}

export function setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
}

export function getAuthHeader(): Record<string, string> {
    const token = getAccessToken()
    if (!token) return {}

    return {
        Authorization: `Bearer ${token}`,
    }
}