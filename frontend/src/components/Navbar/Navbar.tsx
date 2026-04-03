import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="flex flex-row justify-between items-center mt-5 my-5">
            <div className="flex items-center">
                <div className='p-2 px-5 rounded-full bg-[var(--secondary)] uppercase font-tertiary text-base font-semibold tracking-tight'> <Link href='/'> Browse </Link> </div>
                <div className='p-2 px-5 rounded-full bg-[var(--secondary)] uppercase font-tertiary text-base font-semibold tracking-tight'> <Link href='/'> Contact </Link> </div>
                <div className='p-2 px-5 rounded-full bg-[var(--secondary)] uppercase font-tertiary text-base font-semibold tracking-tight'> <Link href='/'> Upload </Link> </div>
            </div>
            <div className="flex items-center text-[var(--primary-light)] font-bold">
                PLAYPIT
            </div>
            <div className="flex items-center">
                <div className='p-2 px-4 rounded-lg text-[var(--black)] bg-[var(--white)] uppercase font-tertiary text-base font-semibold tracking-tight'> <Link href='/'> Get Started </Link> </div>
            </div>
        </nav>
    )
}