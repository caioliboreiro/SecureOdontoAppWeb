
import type {NextConfig} from 'next';

const securityHeaders = [
  // HSTS é injetado pelo server.js apenas nas respostas HTTPS — não aqui
  // Previne que a página seja embutida em iframes de outros domínios
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Bloqueia detecção automática de MIME type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Controla informações do referrer enviadas a outros sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Desabilita funcionalidades sensíveis do navegador não utilizadas
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Proteção extra contra XSS em navegadores legados
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Ativa prefetch de DNS para melhor performance
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    // Route Handlers (route.ts) têm precedência sobre rewrites no App Router.
    // /api/secure/* e /api/public-key são route handlers e nunca chegam aqui.
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3333/:path*',
        // destination: `${process.env.NEXT_PUBLIC_BASEURL}:path*`, //local
      },
    ];
  },
};

export default nextConfig;
