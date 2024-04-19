import { Sequelize } from 'sequelize';
import Transaction from '../models/transactionModel.js';
import Stock from '../models/stockModel.js';

export async function getMetrics(userId) {
  // Counts the total number of unique stocks for pagination
  const countStocks = await Transaction.findAll({
    where: { user_id: userId },
    attributes: [
      'user_id', // Group by user_id
      [Sequelize.literal('COUNT(DISTINCT stock_id)'), 'unique_stock_count'],
    ],
    group: ['user_id'],
  });

  // Search and calculates user metrics for the portolio dashboard
  const getPortfolioMetrics = await Transaction.findAll({
    attributes: [
      'user_id',
      'stock_id',
      [Sequelize.col('stock.ticker'), 'ticker'],
      [Sequelize.col('stock.company'), 'company'],
      [Sequelize.col('stock.logo_url'), 'logo_url'],
      [
        Sequelize.literal(
          `SUM(CASE WHEN type = 'buy' THEN shares ELSE -1 * shares END)`
        ),
        'current_shares',
      ],
      [
        Sequelize.literal(
          `SUM(CASE WHEN type = 'buy' THEN shares * stock_price END) / SUM (CASE WHEN type = 'buy' THEN shares END)`
        ),
        'average_price',
      ],
      [
        Sequelize.literal(
          `CASE WHEN SUM(CASE WHEN type = 'buy' THEN shares END) > 0 THEN SUM(CASE WHEN type = 'buy' THEN shares * stock_price END) / SUM(CASE WHEN type = 'buy' THEN shares END) ELSE NULL END,
	SUM(CASE WHEN type = 'buy' THEN shares ELSE -1 * shares END) * SUM(CASE WHEN type = 'buy' THEN shares * stock_price END) / SUM (CASE WHEN type = 'buy' THEN shares END)`
        ),
        'total_invested',
      ],
    ],
    include: {
      model: Stock,
      attributes: [],
      required: true,
    },
    where: { user_id: userId },
    group: ['user_id', 'stock_id', 'ticker', 'company', 'logo_url'],
  });

  return { getPortfolioMetrics, countStocks };
}
