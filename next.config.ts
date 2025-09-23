import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desabilitando temporariamente o modo standalone para testar se isso resolve o problema com os estilos
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/euaconecta-files/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  // Configuração para permitir cross-origin requests em desenvolvimento
  allowedDevOrigins: [
    'app.euaconecta.com',
    'dev.euaconecta.com',
    'euaconecta.com',
    'www.euaconecta.com'
  ],
};

export default nextConfig;
