import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Stock from './stockModel.js';

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
  shares: {
    type: DataTypes.DECIMAL, // Flexible decimal precision
    allowNull: false,
  },
  stock_price: {
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
  transaction_cost: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'stocks',
      key: 'id',
    },
  },
});

Transaction.belongsTo(Stock, {
  foreignKey: 'stock_id',
});

export default Transaction;
