import Transaction from '../models/transactionModel.js';
import Stock from '../models/stockModel.js';
import apicache from 'apicache';
import { Op } from 'sequelize';
import { validateTransactions } from '../utils/trasanctionValidation.js';
import { hasSufficientFunds } from '../utils/hasSufficientFunds.js';
import { paginationValidation } from '../utils/paginationValidation.js';

// @desc Gets all the transactions from the user
// @route POST /api/transactions
// @access Private
const getAllTransactions = async (req, res) => {
  // Retrieves the page and size from the params of the request
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder || 'DESC';
  const searchQuery = req.query.searchQuery
    ?.split(',')
    .map((symbol) => symbol.trim());

  const order = () => {
    if (sortBy.toLowerCase() == 'company' || sortBy.toLowerCase() == 'ticker') {
      return [Stock, sortBy, sortOrder];
    } else {
      return [sortBy, sortOrder];
    }
  };

  // Sets the WHERE query param
  const whereClause = () => {
    const clause = {
      user_id: req.user.id,
    };

    if (searchQuery) {
      // If search query is provided, filter by stock ticker
      clause[Op.or] = searchQuery.map((symbol) => ({
        '$stock.ticker$': { [Op.like]: '%' + symbol.toUpperCase() + '%' },
      }));
    }
    return clause;
  };

  // Validates the pagination params
  const { page, size } = paginationValidation(pageAsNumber, sizeAsNumber);

  try {
    const transactions = await Transaction.findAndCountAll({
      limit: size,
      offset: page * size,
      include: Stock,
      where: whereClause(),
      order: [order()],
    });

    res.status(201).json({
      transactions,
      totalPages: Math.ceil(transactions.count / size),
      page,
      sortBy,
      sortOrder,
      searchQuery: req.query.searchQuery,
    });
  } catch (error) {
    res.status(500).json({
      error:
        'An unexpected error occurred while retrieving transactions. Please try again later.',
    });
  }
};

// @desc Adds a new transaction
// @route POST /api/transactions
// @access Private
const addNewTransaction = async (req, res) => {
  // Obtains transaction data
  const transactionData = req.body;
  const requiredFields = [
    'date',
    'type',
    'ticker',
    'stock_price',
    'shares',
    'currency',
  ];

  // Checks if there's any validation errors
  const validationErrors = validateTransactions(
    transactionData,
    requiredFields
  );
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ error: validationErrors });
  }

  //checks if theres suficient funds in case of a sell transaction
  if (transactionData.type === 'sell') {
    if (!(await hasSufficientFunds(transactionData, req.user.id, 'add'))) {
      return res.status(409).json({
        error:
          'You do not have enough shares to complete the sell transaction. Please review your available shares and try again.',
      });
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
        sector: transactionData.sector,
      },
    });

    const transaction = await Transaction.create({
      user_id: req.user.id,
      stock_id: stock.id,
      date: transactionData.date,
      type: transactionData.type,
      shares: transactionData.shares,
      stock_price: transactionData.stock_price,
      transaction_cost:
        parseFloat(transactionData.stock_price) *
        parseFloat(transactionData.shares),
    });

    // Cleans the cache when a transaction is added
    apicache.clear();

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
      transaction_cost: transaction.transaction_cost,
      currency: stock.currency,
    });
  } catch (error) {
    res.status(500).json({
      error:
        'An unexpected error occurred while adding the transaction. Please try again later.',
    });
  }
};

// @desc Updates a transaction
// @route PUT /api/transactions/:id
// @access Private
const updateTransactionById = async (req, res) => {
  const transaction_id = req.params.id;
  const transactionData = req.body;
  const requiredFields = ['date', 'type', 'stock_price', 'shares', 'ticker'];

  // Checks if there's any validation errors
  const validationErrors = validateTransactions(
    transactionData,
    requiredFields
  );
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const getTransaction = await Transaction.findByPk(transaction_id, {
      include: Stock,
    });

    // Check if transaction exists
    if (!getTransaction) {
      return res.status(404).json({
        error:
          'The requested transaction could not be found. Please ensure the transaction ID is correct and try again.',
      });
    }

    // Check if the transaction belongs to the user
    if (getTransaction.get('user_id') !== req.user.id) {
      return res.status(401).json({
        error:
          'You are not authorized to perform this action. Please ensure you have the necessary permissions.',
      });
    }

    // Checks if the transaction type is the same from the database
    if (transactionData.type !== getTransaction.get('type')) {
      return res.status(409).json({
        error:
          'Cannot update transaction type. Transactions must remain consistent to ensure data integrity.',
      });
    }

    // Checks if the transaction type is the same from the database
    if (
      transactionData.ticker.toUpperCase() !==
      getTransaction.dataValues.stock.ticker.toUpperCase()
    ) {
      return res.status(409).json({
        error:
          'Cannot update transaction ticker. Transactions ticker must remain consistent to ensure data integrity.',
      });
    }

    //checks if theres suficient funds in case of a sell transaction
    if (transactionData.type === 'sell') {
      if (
        !(await hasSufficientFunds(
          transactionData,
          req.user.id,
          'edit',
          getTransaction.get('shares')
        ))
      ) {
        return res.status(409).json({
          error:
            'You do not have enough shares to complete the sell transaction. Please review your available shares and try again.',
        });
      }
    }

    getTransaction.set({
      shares: transactionData.shares,
      date: transactionData.date,
      stock_price: transactionData.stock_price,
      transaction_cost:
        parseFloat(transactionData.stock_price) *
        parseFloat(transactionData.shares),
    });

    const updatedTransaction = await getTransaction.save();

    //Cleans the cache when a new transaction is updated
    apicache.clear();

    res.status(201).json({
      id: transaction_id,
      date: updatedTransaction.date,
      shares: updatedTransaction.shares,
      stock_price: updatedTransaction.stock_price,
    });
  } catch (error) {
    res.status(500).json({
      error:
        'An unexpected error occurred while updating the transaction. Please try again later.',
    });
  }
};

// @desc Deletes a transaction
// @route DELETE /api/transactions/:id
// @access Private
const deleteTransactionById = async (req, res) => {
  const transaction_id = req.params.id;

  try {
    const getTransaction = await Transaction.findByPk(transaction_id, {
      include: Stock,
    });

    // Check if the transaction belongs to the user
    if (getTransaction.get('user_id') !== req.user.id) {
      return res.status(401).json({
        error:
          'You are not authorized to perform this action. Please ensure you have the necessary permissions.',
      });
    }

    //checks if theres suficient funds in case of a sell transaction
    if (getTransaction.type === 'buy') {
      if (
        !(await hasSufficientFunds(
          getTransaction.stock,
          req.user.id,
          'delete',
          getTransaction.shares
        ))
      ) {
        return res.status(409).json({
          error:
            'You do not have enough shares to complete the sell transaction. Please review your available shares and try again.',
        });
      }
    }

    // Deletes the transaction from the database
    await Transaction.destroy({
      where: {
        id: transaction_id,
      },
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      error:
        'An unexpected error occurred while deleting the transaction. Please try again later.',
    });
  }
};

export {
  addNewTransaction,
  getAllTransactions,
  updateTransactionById,
  deleteTransactionById,
};
