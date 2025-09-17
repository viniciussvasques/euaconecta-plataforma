import { Metadata } from 'next'
import { LandingPageContent } from '@/components/landing-page-content'

export const metadata: Metadata = {
  title: 'EuaConecta - Compre nos EUA e Receba no Brasil | Frete Internacional',
  description: 'Compre produtos das melhores marcas americanas (Nike, Adidas, Amazon, Apple) e receba no Brasil. Consolidação inteligente, frete otimizado e economia de até 70%.',
  keywords: 'compras EUA, frete internacional, Nike, Adidas, Amazon, Apple, consolidação, envio Brasil',
  authors: [{ name: 'EuaConecta' }],
  creator: 'EuaConecta',
  publisher: 'EuaConecta',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://app.euaconecta.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EuaConecta - Compre nos EUA e Receba no Brasil',
    description: 'Compre produtos das melhores marcas americanas e receba no Brasil. Consolidação inteligente, frete otimizado e economia de até 70%.',
    url: 'https://app.euaconecta.com',
    siteName: 'EuaConecta',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EuaConecta - Compre nos EUA e Receba no Brasil',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EuaConecta - Compre nos EUA e Receba no Brasil',
    description: 'Compre produtos das melhores marcas americanas e receba no Brasil. Consolidação inteligente, frete otimizado e economia de até 70%.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function LandingPage() {
  return <LandingPageContent />
}
