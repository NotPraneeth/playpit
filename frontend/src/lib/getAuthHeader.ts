export function getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('access_token')

    if (!token) {
        return {}
    }

    return {
        Authorization: `Bearer ${token}`,
    }
}