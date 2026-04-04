'use client'

import { useState } from 'react'
import EmailStep from '@/components/Auth/emailStep'
import LoginStep from '@/components/Auth/loginStep'
import SignupStep from '@/components/Auth/signupStep'
import VerifyStep from '@/components/Auth/verifyStep'

export default function AuthPage() {
    const [step, setStep] = useState<'email' | 'login' | 'signup' | 'verify'>('email')
    const [email, setEmail] = useState('')

    return (
        <div className="flex items-center justify-center h-screen">
            {step === 'email' && (
                <EmailStep
                    onNext={(email, isExistingUser) => {
                        setEmail(email)
                        setStep(isExistingUser ? 'login' : 'signup')
                    }}
                />
            )}

            {step === 'login' && (
                <LoginStep
                    email={email}
                    onSuccess={(tokens) => {
                        localStorage.setItem('access_token', tokens.access_token)
                        localStorage.setItem('refresh_token', tokens.refresh_token)
                        console.log('STORED:', localStorage.getItem('access_token'))
                        window.location.href = '/'
                    }}
                />
            )}

            {step === 'signup' && (
                <SignupStep
                    email={email}
                    onOTPSent={() => setStep('verify')}
                />
            )}

            {step === 'verify' && (
                <VerifyStep
                    email={email}
                    onSuccess={(tokens) => {
                        localStorage.setItem('access_token', tokens.access_token)
                        localStorage.setItem('refresh_token', tokens.refresh_token)
                        console.log('STORED:', localStorage.getItem('access_token'))
                        window.location.href = '/'
                    }}
                />
            )}
        </div>
    )
}