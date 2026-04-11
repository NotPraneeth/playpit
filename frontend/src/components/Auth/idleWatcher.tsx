'use client'

import { useEffect } from 'react'
import { setupIdleLogout } from '@/lib/idleLogout'
import { getAccessToken } from '@/lib/auth'

export default function IdleWatcher() {
    useEffect(() => {
        const interval = setInterval(() => {
            const token = getAccessToken()

            if (token) {
                setupIdleLogout()
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return null
}