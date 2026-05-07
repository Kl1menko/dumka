/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.myshopify.com" },
      { protocol: "https", hostname: "www.nadiyadumka.com" },
      { protocol: "https", hostname: "nadiyadumka.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    minimumCacheTTL: 31536000,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
