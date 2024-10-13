const isProduction = process.env.NODE_ENV === 'production';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: !isProduction,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: ['avatars.githubusercontent.com'],
  },

  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = withBundleAnalyzer(
  withPWA({
    ...nextConfig,
  }),
);
