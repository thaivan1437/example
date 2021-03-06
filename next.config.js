const withSass = require('@zeit/next-sass');
const withFonts = require('nextjs-fonts');

const dotenv = require('dotenv')
const isDev = process.env.NODE_ENV === 'test';

if (isDev)  {
  dotenv.config({path: '.local.env'})
}

if (!isDev)  {
  dotenv.config({path: `.${process.env.NODE_ENV}.env`})
}



function HACK_removeMinimizeOptionFromSassLoaders(config) {
  console.warn(
    'HACK: Removing `minimize` option from `sass-loader` entries in Webpack config',
  );
  config.module.rules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach(u => {
        if (u.loader === 'sass-loader' && u.options) {
          delete u.options.minimize;
        }
      });
    }
  });
}

module.exports = () => {

  const config = {
    COMPANY_ENV: (() => {
      if (isDev) {
        return withSass(withFonts({
          webpack(config) {
            HACK_removeMinimizeOptionFromSassLoaders(config);
            return config;
          },
        }));
      }
      return 'COMPANY_ENV:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    publicRuntimeConfig:  { 
      CLIENT_ENV: process.env.NODE_ENV,
      DNS: 'https://5532e1ebb8be4e1cac7f5cded65a29ba@o374091.ingest.sentry.io/5222452',
      API_HOST: process.env.API_HOST,
    },
    pageExtensions: ["page.tsx"],
  }

  return config
}
