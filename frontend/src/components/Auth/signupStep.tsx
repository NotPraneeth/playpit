'use client'

import { useState } from 'react'

export default function SignupStep({
    email,
    onOTPSent,
}: {
    email: string
    onOTPSent: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSignup() {
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send OTP')
            }

            onOTPSent()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-96 p-6 bg-white rounded-2xl shadow-md">
            <h1 className="text-xl text-black font-bold mb-2">Create account</h1>
            <p className="text-sm text-gray-500 mb-4">{email}</p>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
                onClick={handleSignup}
                disabled={loading}
                className="bg-black text-white w-full py-2 rounded-lg"
            >
                {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
        </div>
    )
}