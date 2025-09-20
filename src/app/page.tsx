import { Metadata } from 'next'
import { LandingPageServer } from '@/components/landing-page-server'
import { getCustomization } from '@/lib/get-customization'

async function getPartners() {
  try {
    // Em desenvolvimento, vamos usar dados mockados
    const mockPartners = [
      { id: 'nike', name: 'Nike', logo: '/brands/nike.svg', link: 'https://www.nike.com/', isActive: true },
      { id: 'adidas', name: 'Adidas', logo: '/brands/adidas.svg', link: 'https://www.adidas.com/', isActive: true },
      { id: 'amazon', name: 'Amazon', logo: '/brands/amazon.svg', link: 'https://www.amazon.com/', isActive: true },
      { id: 'apple', name: 'Apple', logo: '/brands/apple.svg', link: 'https://www.apple.com/', isActive: true },
      { id: 'bestbuy', name: 'Best Buy', logo: '/brands/bestbuy.svg', link: 'https://www.bestbuy.com/', isActive: true },
      { id: 'target', name: 'Target', logo: '/brands/target.svg', link: 'https://www.target.com/', isActive: true },
      { id: 'walmart', name: 'Walmart', logo: '/brands/walmart.svg', link: 'https://www.walmart.com/', isActive: true },
      { id: 'samsung', name: 'Samsung', logo: '/brands/samsung.svg', link: 'https://www.samsung.com/', isActive: true },
    ]
    return mockPartners
  } catch (error) {
    console.error('Erro ao buscar parceiros:', error)
    return []
  }
}

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

export default async function LandingPage() {
  const customization = await getCustomization()
  const partners = await getPartners()
  return <LandingPageServer customization={customization} partners={partners} />
}
