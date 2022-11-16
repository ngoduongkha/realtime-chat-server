import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    },
  };
});
