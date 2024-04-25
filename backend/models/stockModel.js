import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Stock = sequelize.define('stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticker: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sector: {
    type: DataTypes.STRING,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  logo_url: {
    type: DataTypes.STRING(2048),
    allowNull: true,
  },
});

export default Stock;
