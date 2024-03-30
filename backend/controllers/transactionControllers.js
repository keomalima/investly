import Transaction from '../models/transactionModel.js';
import { validateTransactions } from '../utils/trasanctionValidation.js';

// @desc Gets all the transactions from the user
// @route POST /api/transaction
// @access Private
const getTransactions = async (req, res) => {
  return;
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

  // Calculates the total cost of the transaction
  const total_cost = transactionData.quantity * transactionData.stock_price;

  // Adds transactions to the database
  try {
    const transaction = await Transaction.create({
      user_id: transactionData.user_id,
      date: transactionData.date,
      type: transactionData.type,
      stock_ticker: transactionData.stock_ticker,
      quantity: transactionData.quantity,
      stock_price: transactionData.stock_price,
      total_cost,
      currency: transactionData.currency,
    });

    // Returns the json to the frontend
    res.status(201).json({
      id: transaction.id,
      type: transaction.type,
      date: transaction.date,
      stock_ticker: transaction.stock_ticker,
      quantity: transaction.quantity,
      stock_price: transaction.stock_price,
      currency: transaction.currency,
      total_cost: transaction.total_cost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export { addTransaction, getTransactions };
