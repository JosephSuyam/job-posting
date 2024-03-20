import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

type DBConfig = {
  dialect: Dialect;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

const db_config: DBConfig = {
  dialect: 'postgres',
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  database: String(process.env.DB_NAME),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD)
};

export default db_config;
