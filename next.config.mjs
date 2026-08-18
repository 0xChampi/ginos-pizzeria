/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // @vercel/blob ships undici, whose class-field syntax this Next version's
    // webpack cannot parse. Loading it from node_modules at runtime instead of
    // bundling it sidesteps the parser entirely.
    serverComponentsExternalPackages: ['@vercel/blob'],
  },
}

export default nextConfig
