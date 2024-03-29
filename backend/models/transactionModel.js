import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  },
  stock_ticker: {
    type: DataTypes.STRING(10), // String with a max length of 10
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL, // Flexible decimal precision
    allowNull: false,
  },
  stock_price: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  },
  total_cost: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
});

export default Transaction;
