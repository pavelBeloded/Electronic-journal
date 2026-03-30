import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
