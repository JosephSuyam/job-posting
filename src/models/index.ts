import { Sequelize } from 'sequelize-typescript';
import db_config from '../config/database.config';

let sequelizeConnection: Sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelizeConnection = new Sequelize({
    dialect: 'sqlite',
    host: ':memory:',
  });
} else {
  sequelizeConnection = new Sequelize(
    db_config.database,
    db_config.username,
    db_config.password,
    db_config
  );
}

export default sequelizeConnection;
