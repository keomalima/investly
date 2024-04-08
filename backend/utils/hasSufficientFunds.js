import Transaction from '../models/transactionModel.js';
import Stock from '../models/stockModel.js';
import { Sequelize } from 'sequelize';

export async function hasSufficientFunds(transaction, id, type, shares) {
  // Searches for the stock in the database
  const getStock = await Stock.findOne({
    where: { ticker: transaction.ticker },
  });

  // If the stock doesn't exist, returns false
  if (!getStock) {
    return false;
  }

  // Calculates in the database if there's sufficient shares
  const getAvailableShares = await Transaction.findOne({
    attributes: [
      [
        Sequelize.literal(
          `SUM(CASE WHEN type = 'buy' THEN shares ELSE -1 * shares END)`
        ),
        'available_shares',
      ],
    ],
    where: {
      user_id: id,
      stock_id: getStock.id,
    },
  });

  // Checks wether the user has sufficient funds
  const available_shares = getAvailableShares
    ? getAvailableShares.get('available_shares')
    : 0;

  // When user is editing a transaction this will take in considerantion the new shares value for the calculation
  if (type === 'edit') {
    const actual_shares =
      parseFloat(available_shares) + parseFloat(shares) - transaction.shares;
    return actual_shares >= 0;
  } else {
    return parseFloat(available_shares) - transaction.shares >= 0;
  }
}
