import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TruthLens AI — Multimodal Deepfake & Fake News Forensic Intelligence Platform',
  description:
    'Real-time multimodal forensic sentinel for detecting fake news, synthetic media generation, voice cloning, and video deepfakes with Error Level Analysis (ELA) and IFCN fact verification.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
        {children}
      </body>
    </html>
  )
}
