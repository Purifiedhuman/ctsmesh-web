/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development' // Remove console.log in production
  },
  images: {
    domains: ['utfs.io']
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/dashboard/page'
      }
    ];
  },
  output: 'standalone'
};

const withPWA = require('next-pwa')({
  dest: 'public', // Destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true // Skip waiting for service worker activation
});

module.exports = withPWA(nextConfig);
