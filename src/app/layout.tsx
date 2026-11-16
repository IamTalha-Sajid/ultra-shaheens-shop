import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cartContext'
import SiteLoader from '@/components/SiteLoader'

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://shop.ultrashaheens.com'),
  title: 'Ultra Shaheens Shop',
  description: 'Official merchandise store of Ultra Shaheens — Pakistan\'s most passionate football community.',
  keywords: ['Ultra Shaheens', 'merchandise', 'shop', 'Pakistan football', 'jersey', 'shirt'],
  authors: [{ name: 'Ultra Shaheens' }],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Ultra Shaheens Shop',
    title: 'Ultra Shaheens Shop',
    description: 'Official merchandise store of Ultra Shaheens — Pakistan\'s most passionate football community.',
    images: [{ url: '/images/brand/og-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: 'Ultra Shaheens Official Shop' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ultrashaheens',
    images: ['/images/brand/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        {/* Hide the intro loader before first paint on repeat visits or reduced motion. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('us-loader-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-loader-seen','')}catch(e){}",
          }}
        />
      </head>
      <body className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}>
        <SiteLoader />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
