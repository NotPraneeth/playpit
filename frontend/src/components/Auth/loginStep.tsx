'use client'

import { useState } from 'react'
import { handleAuthSuccess } from '@/lib/authSuccess'

export default function LoginStep({
    email,
}: {
    email: string
    onSuccess: (tokens: any) => void
}) {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleLogin() {
        setError('')

        if (!password) {
            setError('Password required')
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }
            handleAuthSuccess(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-96 p-6 bg-white rounded-2xl shadow-md">
            <h1 className="text-xl text-black font-bold mb-2">Welcome back</h1>
            <p className="text-sm text-gray-500 mb-4">{email}</p>

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="border text-black p-2 w-full mb-2 rounded-lg"
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-black text-white w-full py-2 rounded-lg"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </div>
    )
}