import type { Metadata } from "next";

import { aileron } from '@/lib/fonts'
import { Boldonse as navLogo } from 'next/font/google'
import { Roboto } from 'next/font/google'
import "./globals.css";


import Navbar from "@/components/Navbar/Navbar";
import IdleWatcher from '@/components/Auth/idleWatcher'


export const metadata: Metadata = {
  title: "Playpit",
  description: "Share the games you love",
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-roboto',
})

const navLogoFont = navLogo({
  weight: '400',
  variable: '--font-navLogo',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className={`${aileron.variable} ${navLogoFont.variable} ${roboto.variable} min-h-full flex flex-col`}>
        <IdleWatcher />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
