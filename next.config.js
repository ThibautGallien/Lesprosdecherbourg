/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "images.pexels.com", "localhost"],
  },

  eslint: {
    // Ignorer les erreurs ESLint en production
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "lesprosdecherbourg.fr",
          },
        ],
        destination: "https://www.lesprosdecherbourg.fr/:path*",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
};

module.exports = nextConfig;
