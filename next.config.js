/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/DAO-web3-voting-system' : '',
  assetPrefix: isGithubPages ? '/DAO-web3-voting-system/' : '',
}

module.exports = nextConfig
