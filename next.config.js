// next.config.js

const isGithubPages = process.env.NODE_ENV === 'production'

export const output = 'export'
export const basePath = isGithubPages ? '/DAO-web3-voting-system' : ''
export const assetPrefix = isGithubPages ? '/DAO-web3-voting-system/' : ''
