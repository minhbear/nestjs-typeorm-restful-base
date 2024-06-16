import { APP_ENV } from '@common/constant';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('dotenv');

env.config();

export const config = {
  api: {
    nodeEnv: process.env.APP_ENV || APP_ENV.LOCAL,
    endpoint: process.env.API_HOST || '',
  },
  dbConnectionString: process.env.DATABASE_URL as string,
  domain: process.env.APP_HOST || 'localhost',
  port: parseInt(process.env.APP_PORT) || 3000,
  path: process.env.API_PATH || 'api',
  redisUrl: process.env.REDIS_HOST
    ? `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`
    : '',
  redis: {
    host: (process.env.REDIS_HOST as string) || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: parseInt(process.env.REDIS_DB || '0'),
    password: process.env.REDIS_PASSWORD as string,
  },
  jwt: {
    accessToken: process.env.JWT_ACCESS_SECRET || 'access-secret',
    refreshToken: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '5m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30m',
  },
  walletNonceTtl: parseInt(process.env.WALLET_NONCE_TTL, 10) || 3000,
};
