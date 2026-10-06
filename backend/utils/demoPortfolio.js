import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';
import User from '../models/userModel.js';
import Stock from '../models/stockModel.js';
import Transaction from '../models/transactionModel.js';

export const DEMO_EMAIL = 'demo@investly.example';
export const demoEnabled = () => process.env.DEMO_ENABLED === 'true';

// Fictional purchase prices for a sample portfolio; current valuations come from FMP.
export const demoTrades = [
  { ticker: 'AAPL', company: 'Apple Inc.', sector: 'Technology', date: '2026-03-12', type: 'buy', shares: 12, price: 185 },
  { ticker: 'MSFT', company: 'Microsoft Corporation', sector: 'Technology', date: '2026-04-08', type: 'buy', shares: 6, price: 390 },
  { ticker: 'NVDA', company: 'NVIDIA Corporation', sector: 'Technology', date: '2026-05-20', type: 'buy', shares: 18, price: 110 },
  { ticker: 'DIS', company: 'The Walt Disney Company', sector: 'Communication Services', date: '2026-06-15', type: 'buy', shares: 15, price: 95 },
  { ticker: 'AAPL', company: 'Apple Inc.', sector: 'Technology', date: '2026-08-03', type: 'buy', shares: 5, price: 205 },
  { ticker: 'NVDA', company: 'NVIDIA Corporation', sector: 'Technology', date: '2026-09-10', type: 'sell', shares: 4, price: 130 },
];

export function createDemoSeeder({ sequelize, User, Stock, Transaction, hashPassword }) {
  return async function seedDemoPortfolio() {
    const password = await hashPassword(randomBytes(32).toString('hex'));
    return sequelize.transaction(async (transaction) => {
      const [user] = await User.findOrCreate({
        where: { email: DEMO_EMAIL },
        defaults: { username: 'Demo Investor', password },
        transaction,
      });
      // Serialize startup seeds for this account without resetting visitors' edits.
      await user.reload({ transaction, lock: transaction.LOCK.UPDATE });
      for (const trade of demoTrades) {
        const [stock] = await Stock.findOrCreate({
          where: { ticker: trade.ticker },
          defaults: {
            company: trade.company,
            sector: trade.sector,
            currency: 'USD',
            logo_url: `https://financialmodelingprep.com/image-stock/${trade.ticker}.png`,
          },
          transaction,
        });
        await Transaction.findOrCreate({
          where: { user_id: user.id, stock_id: stock.id, date: new Date(`${trade.date}T12:00:00Z`), type: trade.type },
          defaults: { shares: trade.shares, stock_price: trade.price, transaction_cost: trade.shares * trade.price },
          transaction,
        });
      }
      return user;
    });
  };
}

export const seedDemoPortfolio = createDemoSeeder({
  sequelize, User, Stock, Transaction,
  hashPassword: (password) => bcrypt.hash(password, 10),
});
