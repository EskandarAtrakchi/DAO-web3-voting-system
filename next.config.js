const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? '/DAO-web3-voting-system/' : '',
  basePath: isProd ? '/DAO-web3-voting-system' : '',
};

module.exports = nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     webpack: (config) => {
//       config.externals.push('pino-pretty', 'lokijs', 'encoding');
//       return config;
//     },
//     i18n: {
//       locales: ['en-US', 'zh-CN'],
//       defaultLocale: 'en-US',
//     },
//   };
  
//   module.exports = nextConfig;
  