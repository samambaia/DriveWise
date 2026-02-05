/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Firebase hosting for now to test basic functionality
  experimental: {
    // This might help with Firebase issues
  },
  // Add basic configuration
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;