/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    CLOUD_RUN_URL: process.env.CLOUD_RUN_URL || 'https://bc-printer-monitor-991694103609.us-central1.run.app'
  }
}

module.exports = nextConfig
