module.exports = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  webpack: (config, options) => {
    config.resolve.alias['@'] = './src';

    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
  images: {
    formats: ['image/webp'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};
