import { getStockData } from '../utils/apiCall.js';
import { getMetrics } from '../utils/porfolioMetrics.js';

// @desc Obtains portfolio metrics
// @route GET /api/portfolio
// @access Private
const getPortfolio = async (req, res) => {
  try {
    // Get some metrics from the database
    const getPortfolioMetrics = await getMetrics(req.user.id);
    //Obtains the all the users tickers
    const stock_tickers = getPortfolioMetrics.map(
      (ticker) => ticker.dataValues.ticker
    );
    // Calls an external api to get data from the companies
    const stockData = await getStockData(stock_tickers);

    res.status(201).json({
      getPortfolioMetrics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        'An unexpected error occurred while retrieving portofolio metrics. Please try again later.',
    });
  }
};

const testRoute = async (req, res) => {};

export { getPortfolio, testRoute };
