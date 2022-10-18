/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_WEBSOCKET_PROVIDER: process.env.NEXT_WEBSOCKET_PROVIDER,
  },
}

module.exports = nextConfig
