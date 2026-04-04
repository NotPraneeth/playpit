
export function getAuthHeader() {
    const token = localStorage.getItem('access_token')

    if (!token) {
        window.location.href = '/auth'
        return {}
    }

    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}