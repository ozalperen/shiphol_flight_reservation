export default {
  port: "PORT",
  emailFrom: "EMAIL_USER",

  postgresConfig: {
    developmentHost: "POSTGRES_DEVELOPMENT_HOST",
    producHost: "POSTGRES_PRODUCTION_HOST",
    port: "POSTGRES_PORT",
    username: "POSTGRES_USER",
    password: "POSTGRES_PASSWORD",
    database: "POSTGRES_DB",
  },

  redisDevelopmentHost: "REDIS_DEVELOPMENT_HOST",
  redisProductionHost: "REDIS_PRODUCTION_HOST",

  accessTokenExpiresIn: "accessTokenExpiresIn",
  refreshTokenExpiresIn: "refreshTokenExpiresIn",
  redisCacheExpiresIn: "redisCacheExpiresIn",

  accessTokenPrivateKey: "JWT_ACCESS_TOKEN_PRIVATE_KEY",
  accessTokenPublicKey: "JWT_ACCESS_TOKEN_PUBLIC_KEY",
  refreshTokenPrivateKey: "JWT_REFRESH_TOKEN_PRIVATE_KEY",
  refreshTokenPublicKey: "JWT_REFRESH_TOKEN_PUBLIC_KEY",

  developmentOrigin: "DEVELOPMENT_ORIGIN",
  developmentHost: "DEVELOPMENT_HOST",
  developmentCookieDomain: "DEVELOPMENT_COOKIEDOMAIN",

  productionOrigin: "PRODUCTION_ORIGIN",
  productionHost: "PRODUCTION_HOST",
  productionCookieDomain: "PRODUCTION_COOKIEDOMAIN",

  smtp: {
    host: "EMAIL_HOST",
    pass: "EMAIL_PASS",
    port: "EMAIL_PORT",
    user: "EMAIL_USER",
  },
};
