import Transaction from '../models/transactionModel.js';

// @desc Adds a new transaction
// @route POST /api/transaction/add
// @access Private
const addTransaction = async (req, res) => {
  // Obtains transaction data
  const {
    user_id,
    date,
    type,
    stock_ticker,
    quantity,
    stock_price,
    total_cost,
    currency,
  } = req.body;

  // Adds transactions to the database
  try {
    const transaction = await Transaction.create({
      user_id,
      date,
      type,
      stock_ticker,
      quantity,
      stock_price,
      total_cost,
      currency,
    });

    res.status(201).json({
      id: transaction.id,
      type: transaction.type,
      date: transaction.date,
      stock_ticker: transaction.stock_ticker,
      quantity: transaction.quantity,
      stock_price: transaction.stock_price,
      total_cost: transaction.total_cost,
      currency: transaction.currency,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export { addTransaction };
