// app/layout.tsx

import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Цветочная лавка — Премиум цветы с доставкой',
  description: 'Премиум цветочный магазин в Якутске и Мирном. Свежие букеты, композиции в коробках, доставка за 2 часа. Собери свой букет в конструкторе!',
  keywords: ['цветы', 'букеты', 'доставка цветов', 'Якутск', 'Мирный', 'флористика', 'свадебные букеты'],
  authors: [{ name: 'Цветочная лавка' }],
  creator: 'Цветочная лавка',
  publisher: 'Цветочная лавка',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://florale.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Цветочная лавка — Премиум цветы с доставкой',
    description: 'Свежие букеты и композиции с доставкой за 2 часа. Собери свой уникальный букет!',
    url: 'https://florale.ru',
    siteName: 'Цветочная лавка',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Цветочная лавка',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Цветочная лавка',
    description: 'Премиум цветы с доставкой',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Цветочная лавка',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#C5A5B8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
