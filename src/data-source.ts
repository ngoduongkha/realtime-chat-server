import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from './modules/database/strategies';
import { MainSeeder } from './modules/database/seeds/main.seed';

config({ path: '.env' });

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '1', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [resolve(__dirname, '**/database/entities/*.entity.{js,ts}')],
  migrations: [resolve(__dirname, '../migrations/*.{js,ts}')],
  migrationsTableName: '__migrations',
  logging: process.env.NODE_ENV === 'dev',
  seeds: [MainSeeder],
  factories: [resolve(__dirname, '**/database/factories/**/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
};

export default new DataSource(options);
