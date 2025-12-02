/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bu ayar bcrypt hatalarını engeller (Kalkanımız):
  serverExternalPackages: ['bcrypt-ts', 'bcryptjs'],

  // Resim yükleme izinleri:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  
  // TypeScript hatalarını yoksay:
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;