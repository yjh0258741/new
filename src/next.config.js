const withLess = require('@zeit/next-less');
// const isProd = process.env.NODE_ENV === 'production'

module.exports = withLess({
  /* config options here */
  assetPrefix: 'https://iot.cloud.tencent.com/scf/explorerh5oauth',
});
