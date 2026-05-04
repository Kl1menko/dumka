import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nadiyadumka.com'),
  title: 'DUMKA by Nadiya Dumka | Маки 2026',
  description: 'Premium womenswear, showroom in Lviv, and the Maky Spring-Summer 2026 collection.',
  openGraph: {
    type: 'website',
    siteName: 'DUMKA by Nadiya Dumka',
    title: 'DUMKA by Nadiya Dumka | Маки 2026',
    description: 'Premium womenswear, showroom in Lviv, and the Maky Spring-Summer 2026 collection.',
    images: [{ url: '/images/hero-maky.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DUMKA by Nadiya Dumka | Маки 2026',
    description: 'Premium womenswear, showroom in Lviv, and the Maky Spring-Summer 2026 collection.',
    images: ['/images/hero-maky.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} ${cormorant.variable} bg-white font-sans text-[#111111] antialiased`}>
        {children}
      </body>
    </html>
  )
}
