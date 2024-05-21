import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Connects to the database
const sequelize = new Sequelize(
  process.env.POSTGRESQL_DB_URI ||
    `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // This might be necessary depending on your SSL configuration
      },
    },
  }
);

// Tests the connection
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testDbConnection };
