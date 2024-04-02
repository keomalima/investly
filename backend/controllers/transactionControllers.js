import Transaction from '../models/transactionModel.js';
import Stock from '../models/stockModel.js';
import { validateTransactions } from '../utils/trasanctionValidation.js';
import { getPortolioMetrics } from '../utils/porfolioMetrics.js';
import { fundsValidation } from '../utils/fundsValidation.js';

// @desc Gets the data for the dashboard
// @route POST /api/transaction/portolio
// @access Private
const getPortolio = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
      include: Stock,
    });

    const averagePrice = getPortolioMetrics(transactions);

    res.status(201).json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const testMethod = async (req, res) => {
  const transactionData = req.body;

  if (transactionData.type === 'sell') {
    await fundsValidation(transactionData, req.user.id);
  }
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

  // Adds transactions to the database
  try {
    //checks if theres suficient funds in case of a sell transaction
    if (transactionData.type === 'sell') {
      await fundsValidation(transactionData, req.user.id);
    }

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
    res.status(500);
    throw new Error('Something went wrong');
  }
};

export { addTransaction, getTransactions, getPortolio, testMethod };
