import { setTokens } from './auth'

export function handleAuthSuccess(data: any) {
    const { access_token, refresh_token } = data

    if (!access_token || !refresh_token) {
        throw new Error('Invalid auth response')
    }

    setTokens(access_token, refresh_token)

    // redirect to home (or dashboard later)
    window.location.href = '/'
}