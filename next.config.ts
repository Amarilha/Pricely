import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      'googleads.g.doubleclick.net',
      'pagead2.googlesyndication.com'
    ],
  },
};

export default nextConfig;