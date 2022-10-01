import { cleanEnv, port, str } from "envalid";
import { url } from "inspector";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),

    accessTokenExpiresIn: str(),
    refreshTokenExpiresIn: str(),
    redisCacheExpiresIn: str(),

    POSTGRES_DEVELOPMENT_HOST: str(),
    POSTGRES_PRODUCTION_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),

    REDIS_DEVELOPMENT_HOST: str(),
    REDIS_PRODUCTION_HOST: str(),
    REDIS_PORT: port(),

    JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
    JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
    JWT_REFRESH_TOKEN_PRIVATE_KEY: str(),
    JWT_REFRESH_TOKEN_PUBLIC_KEY: str(),

    DEVELOPMENT_ORIGIN: str(),
    DEVELOPMENT_HOST: str(),
    DEVELOPMENT_COOKIEDOMAIN: str(),

    PRODUCTION_ORIGIN: str(),
    PRODUCTION_HOST: str(),
    PRODUCTION_COOKIEDOMAIN: str(),

    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    EMAIL_HOST: str(),
    EMAIL_PORT: port(),
    EMAIL_SECURE: str(),
  });
};

export default validateEnv;
