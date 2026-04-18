/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true, // For easier deployment to environments like this
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
