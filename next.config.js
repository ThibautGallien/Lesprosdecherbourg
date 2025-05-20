/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable automatic font optimization since we're doing static export
  optimizeFonts: false,
};

module.exports = nextConfig;