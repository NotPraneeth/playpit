import { handleLogout } from './logout'

let timeout: ReturnType<typeof setTimeout> | null = null

const IDLE_TIME = 30 * 60 * 1000 // 30 minutes

function resetTimer() {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
        handleLogout()
    }, IDLE_TIME)
}

export function setupIdleLogout() {
    if (typeof window === 'undefined') return

    const events = ['mousemove', 'keydown', 'click', 'scroll']

    events.forEach((event) => {
        window.addEventListener(event, resetTimer)
    })

    // start timer immediately
    resetTimer()
}