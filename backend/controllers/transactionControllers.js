import Transaction from '../models/transactionModel.js';
import Stock from '../models/stockModel.js';
import { validateTransactions } from '../utils/trasanctionValidation.js';
import { getPortolioMetrics } from '../utils/porfolioMetrics.js';
import { hasSufficientFunds } from '../utils/hasSufficientFunds.js';

const testMethod = async (req, res) => {
  const transactionData = req.body;
};

// @desc Gets all the transactions from the user
// @route POST /api/transaction/
// @access Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
      include: Stock,
      order: [['date', 'DESC']],
    });

    res.status(201).json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// @desc Adds a new transaction
// @route POST /api/transaction/add
// @access Private
const addTransaction = async (req, res) => {
  // Obtains transaction data
  const transactionData = req.body;

  // Checks if there's any validation errors
  const validationErrors = validateTransactions(transactionData);
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  //checks if theres suficient funds in case of a sell transaction
  if (transactionData.type === 'sell') {
    if (!(await hasSufficientFunds(transactionData, req.user.id))) {
      return res.status(409).json({ error: 'Insufficient shares to sell' });
    }
  }

  // Adds transactions to the database
  try {
    // Checks if there stock exists and create one if not
    const [stock, created] = await Stock.findOrCreate({
      where: { ticker: transactionData.ticker },
      defaults: {
        company: transactionData.company,
        currency: transactionData.currency,
        logo_url: transactionData.logo_url,
      },
    });

    const transaction = await Transaction.create({
      user_id: req.user.id,
      stock_id: stock.id,
      date: transactionData.date,
      type: transactionData.type,
      shares: transactionData.shares,
      stock_price: transactionData.stock_price,
    });

    // Returns the json to the frontend
    res.status(201).json({
      id: transaction.id,
      type: transaction.type,
      date: transaction.date,
      ticker: stock.ticker,
      company: stock.company,
      logo_url: stock.logo_url,
      shares: transaction.shares,
      stock_price: transaction.stock_price,
      currency: stock.currency,
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export { addTransaction, getTransactions, getPortolio, testMethod };
