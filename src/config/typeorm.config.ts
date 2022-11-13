import { resolve } from 'path';

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING,
  synchronize: process.env.DB_SYNCHRONIZE,
  entities: [resolve(__dirname, '../database/entities/*.entity.{js,ts}')],
};
