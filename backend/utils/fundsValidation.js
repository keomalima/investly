import Transaction from '../models/transactionModel.js';
import Stock from '../models/stockModel.js';
import { Sequelize } from 'sequelize';

export async function fundsValidation(transaction, id) {
  try {
    // Searches for the stock in the database
    const getStock = await Stock.findOne({
      where: { ticker: transaction.ticker },
    });

    // If there's no stock in the table it returns 0
    if (!getStock) {
      return null;
    }

    // Gets all the transactions with type 'buy' and counts them
    const getBoughtTransactions = await Transaction.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('shares')), 'total_shares'],
      ],
      where: { user_id: id, stock_id: getStock.id, type: 'buy' },
    });

    // Gets all the transactions with type 'sell' and counts them
    const getSoldTransactions = await Transaction.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('shares')), 'total_shares'],
      ],
      where: { user_id: id, stock_id: getStock.id, type: 'sell' },
    });

    // Checks if there's any transaction with type 'sell'
    if (getSoldTransactions[0].dataValues.total_shares) {
      const fund_check =
        parseFloat(getBoughtTransactions[0].dataValues.total_shares) -
        parseFloat(getSoldTransactions[0].dataValues.total_shares);

      if (fund_check - transaction.shares < 0) {
        throw new Error('Insufficient funds');
      }
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}
