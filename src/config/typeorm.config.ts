import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: isTest ? 'postgres' : process.env.POSTGRES_USER || 'postgres',
  password: isTest ? 'postgres' : process.env.POSTGRES_PASSWORD || 'postgres',
  database: isTest ? 'test_db' : process.env.POSTGRES_DB || 'access-billing',
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: isTest,
  logging: isTest,
  dropSchema: isTest,
  ssl: false,
};

export const dataSource = new DataSource(config); 