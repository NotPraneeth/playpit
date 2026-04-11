import { clearTokens } from './auth'

export function handleLogout() {
    clearTokens()

    if (typeof window !== 'undefined') {
        window.location.href = '/auth'
    }
}