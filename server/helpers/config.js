const isProd = process.env.MODE === 'PRODUCTION';
const config = require(`../../config/${isProd ? 'prodction' : 'development'}.js`);

config.JWT = config.JWT || {};
config.JWT.secret = config.JWT.secret || process.env.TOKEN_SECRET || 's0m3s3cr37';
config.JWT.expiresIn = config.JWT.expiresIn || '1d';

module.exports = config;
