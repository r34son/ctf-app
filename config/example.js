// Name of file should be development.js for dev, and production.js for prod.
module.exports = {
  port: 'server port',
  mongo: {
    url: 'mongo db url',
    username: 'db user',
    password: 'db password',
  },
  JWT: {
    secret: 'JWT secret',
    expiresIn: 'JWT expiresIn',
  },
};
