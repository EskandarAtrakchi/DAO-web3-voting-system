/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true, // optional: helps with GitHub Pages routing
    images: {
      unoptimized: true, // required for static export
    },
    basePath: "/DAO-web3-voting-system", // IMPORTANT for GitHub Pages
  }
  
  module.exports = nextConfig
  