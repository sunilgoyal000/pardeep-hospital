import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "randomuser.me" },
      { hostname: "api.dicebear.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
