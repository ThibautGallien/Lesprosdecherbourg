/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "images.pexels.com", "localhost"],
  },
  // Configuration pour servir les fichiers admin
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
