'use client'

import { useState } from 'react'

export default function EmailStep({
    onNext,
}: {
    onNext: (email: string, exists: boolean) => void
}) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleContinue() {
        setError('')

        if (!email) {
            setError('Email is required')
            return
        }

        // basic validation
        if (!email.includes('@')) {
            setError('Enter a valid email')
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            onNext(email, data.exists)
        } catch (err: any) {
            setError(err.message || 'Failed to check user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-96 p-6 bg-white rounded-2xl shadow-md">
            <h1 className="text-xl text-black font-bold mb-2">Welcome to Playpit</h1>
            <p className="text-sm text-gray-500 mb-4">
                Enter your email to continue
            </p>

            <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleContinue()
                }}
                className="border text-black p-2 w-full mb-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
            />

            {error && (
                <p className="text-red-500 text-sm mb-2">{error}</p>
            )}

            <button
                onClick={handleContinue}
                disabled={loading}
                className="bg-black text-white w-full py-2 rounded-lg hover:opacity-90 transition"
            >
                {loading ? 'Checking...' : 'Continue'}
            </button>
        </div>
    )
}