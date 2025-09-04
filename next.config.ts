import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      'googleads.g.doubleclick.net',
      'pagead2.googlesyndication.com'
    ],
  },
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
};

export default withPWA(pwaConfig)(nextConfig);
