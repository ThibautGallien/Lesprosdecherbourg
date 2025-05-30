/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "images.pexels.com", "localhost"],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ AJOUTEZ CETTE SECTION
  experimental: {
    esmExternals: "loose",
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
