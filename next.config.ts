import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error - turbopack root config type definition is missing
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
