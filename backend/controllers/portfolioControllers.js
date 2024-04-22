import { getStockData } from '../utils/apiCall.js';
import { getMetrics } from '../utils/porfolioMetrics.js';

// @desc Obtains portfolio metrics
// @route GET /api/portfolio
// @access Private
const getPortfolio = async (req, res) => {
  // This method is being cached every 5 minutes to reduce database queries and external API calls
  try {
    // Get the metrics and stock unique count from the database
    const { getPortfolioMetrics, countStocks } = await getMetrics(req.user.id);

    //Obtains all the users tickers
    const stock_tickers = getPortfolioMetrics.map(
      (ticker) => ticker.dataValues.ticker
    );

    // Calls an external api to get data from the companies
    const stockData = await getStockData(stock_tickers);

    // Create a dictionary to store stock current prices
    const pricesByTicker = {};
    stockData.forEach(
      (stock) =>
        (pricesByTicker[stock.symbol] = {
          price: stock.price,
          change: stock.changes,
        })
    );

    //Merges the data from the database and API call data
    getPortfolioMetrics.forEach((metric) => {
      metric.dataValues.current_price = pricesByTicker[metric.dataValues.ticker]
        ? pricesByTicker[metric.dataValues.ticker].price // Accessing price property
        : 0;
      metric.dataValues.current_change = pricesByTicker[
        metric.dataValues.ticker
      ]
        ? pricesByTicker[metric.dataValues.ticker].change // Accessing change property
        : 0;
    });

    res.status(200).json({
      getPortfolioMetrics,
      count: countStocks[0].dataValues.unique_stock_count,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
        ? error.message
        : 'An unexpected error occurred while retrieving portofolio metrics. Please try again later.',
    });
  }
};

export { getPortfolio };
