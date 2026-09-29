import type { Metadata } from 'next'
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TableTop Arbiter — Official Tournament Rules & Errata Grounded Copilot',
  description:
    'Autonomous tabletop rules and TCG arbiter powered by Sanity Structured Content Lake and Model Context Protocol (MCP). Resolves high-stakes rules disputes with zero hallucination.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--felt-0)] text-[var(--parchment)] flex flex-col font-sans selection:bg-[var(--brass)] selection:text-[var(--felt-0)]">
        {children}
      </body>
    </html>
  )
}
