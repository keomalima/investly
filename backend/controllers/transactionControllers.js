import Transaction from '../models/transactionModel.js';
import Stock from '../models/stockModel.js';
import { validateTransactions } from '../utils/trasanctionValidation.js';

// @desc Gets all the transactions from the user
// @route POST /api/transaction
// @access Private
const getTransactions = async (req, res) => {
  const userId = req.params.id;
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
      user_id: transactionData.user_id,
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
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export { addTransaction, getTransactions };
