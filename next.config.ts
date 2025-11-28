import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // This is important for Docker
  experimental: {
    serverComponentsExternalPackages: ["keycloak-js"],
  },
  images: {
    domains: ['www.dev.lesastiqueuses.fr'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
