/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'api.donishyob.com',
      'sciencehub-storage.fra1.digitaloceanspaces.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.donishyob.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sciencehub-storage.fra1.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig;