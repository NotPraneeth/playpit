'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        setIsLoggedIn(!!token)
    }, [])

    function logout() {
        localStorage.clear()
        window.location.href = '/auth'
    }

    return (
        <nav className="flex flex-row justify-between items-center mt-5 my-7 border-b-2 border-black px-5">
            <div className="flex items-center">
                <Link href='/'> <div className='p-2 px-4 text-[var(--black)] border-b-0 border-r-0 border-2 uppercase font-tertiary text-base font-semibold tracking-tight'> Browse </div> </Link>
                <Link href='/'> <div className='p-2 px-4 text-[var(--black)] border-b-0 border-r-0 border-2 uppercase font-tertiary text-base font-semibold tracking-tight'> Contact </div> </Link>
                <Link href='/upload'> <div className='p-2 px-4 text-[var(--black)] border-b-0 border-2 uppercase font-tertiary text-base font-semibold tracking-tight'> Upload </div> </Link>
            </div>
            <div className="flex items-center text-[var(--black)] font-regular font-navlogo uppercase text-2xl">
                PLAYPIT
            </div>
            <div className="flex items-center">
                {
                    isLoggedIn ? (
                        <div className='p-2 cursor-pointer px-4 text-[var(--white)] bg-[var(--black)] uppercase font-tertiary text-base font-semibold tracking-tight mt-1' onClick={logout}> Logout </div>
                    ) : (
                        <Link href='/auth'><div className='p-2 px-4 text-[var(--white)] bg-[var(--black)] uppercase font-tertiary text-base font-semibold tracking-tight mt-1'> Get Started </div></Link>
                    )
                }
            </div>
        </nav>
    )
}