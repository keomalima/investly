import { getStockData } from '../utils/apiCall.js';
import { getMetrics } from '../utils/porfolioMetrics.js';

// @desc Obtains portfolio metrics
// @route GET /api/portfolio
// @access Private
const getPortfolio = async (req, res) => {
  // This method is being cached every 5 minutes to reduce database queries and external API calls
  try {
    // Get some metrics from the database
    const getPortfolioMetrics = await getMetrics(req.user.id);
    //Obtains the all the users tickers
    const stock_tickers = getPortfolioMetrics.map(
      (ticker) => ticker.dataValues.ticker
    );
    // Calls an external api to get data from the companies
    const stockData = await getStockData(stock_tickers);

    // Create a dictionary to store stock current prices
    const pricesByTicker = {};
    stockData.forEach((stock) => (pricesByTicker[stock.symbol] = stock.price));

    //Merges the data from the database and API call data
    getPortfolioMetrics.forEach((metric) => {
      metric.dataValues.current_price = pricesByTicker[metric.dataValues.ticker]
        ? pricesByTicker[metric.dataValues.ticker]
        : 0;
    });

    res.status(200).json({
      getPortfolioMetrics,
    });
  } catch (error) {
    res.status(500).json({
      error:
        'An unexpected error occurred while retrieving portofolio metrics. Please try again later.',
    });
  }
};

export { getPortfolio };
