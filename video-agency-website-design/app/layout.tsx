import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
})

const SITE_URL = 'https://fleir.fr'
const TITLE = 'Fleir — Raconter votre histoire'
const DESCRIPTION = 'Fleir. Raconter votre histoire. Studio de production basé à Paris et Bordeaux.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Fleir',
    locale: 'fr_FR',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fleir — Raconter votre histoire',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F5F5F7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} bg-background`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
