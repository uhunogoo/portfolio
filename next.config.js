module.exports = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  webpack: (config, options) => {
    config.resolve.alias['@'] = './src';
    return config;
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};
