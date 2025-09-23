/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de build
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    optimizePackageImports: ['@prisma/client', 'zod', 'jose']
  },

  // Configurações de segurança
  poweredByHeader: false,
  compress: true,

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ]
  },

  // Configurações de imagem
  images: {
    domains: ['localhost', 'euaconecta.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60
  },

  // Configurações de logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  },

  // Webpack optimizations
  webpack: (config: unknown, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    const webpackConfig = config as { optimization: { splitChunks: { chunks: string } }; module: { rules: unknown[] } }

    // Otimizações para produção
    if (!dev && !isServer) {
      webpackConfig.optimization.splitChunks.chunks = 'all'
    }

    // Suporte para arquivos adicionais
    webpackConfig.module.rules.push({
      test: /\.(pdf|doc|docx)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/files',
          outputPath: 'static/files'
        }
      }
    })

    return webpackConfig
  },

  // Configurações de TypeScript
  typescript: {
    tsconfigPath: './tsconfig.json'
  },

  // Configurações de ESLint
  eslint: {
    ignoreDuringBuilds: false
  }
}

export default nextConfig