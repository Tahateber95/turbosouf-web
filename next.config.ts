import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "89.117.54.131", port: "5280" },
      { protocol: "https", hostname: "*.trycloudflare.com" },
    ],
  },
};

export default nextConfig;
