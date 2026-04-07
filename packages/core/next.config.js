/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Load env from project root when using CLI
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;
