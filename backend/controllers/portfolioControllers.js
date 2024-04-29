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

    if (getPortfolioMetrics.length <= 0) {
      return res.status(204).json([]);
    }

    const filteredMetrics = getPortfolioMetrics.filter((filter) => {
      return filter.dataValues.current_shares !== '0';
    });

    console.log(filteredMetrics);

    //Obtains all the users tickers
    const stock_tickers = filteredMetrics.map(
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

    // Calculates the return of investement
    const totalReturn = (current_price, shares, total_invested) => {
      const current_value = current_price * shares;
      const result = ((current_value - total_invested) / total_invested) * 100;
      return Math.abs(result) < 1e-10 ? 0 : result.toFixed(2);
    };

    //Merges the data from the database and API call data
    filteredMetrics.forEach((metric) => {
      metric.dataValues.current_price = pricesByTicker[metric.dataValues.ticker]
        ? pricesByTicker[metric.dataValues.ticker].price // Accessing price property
        : 0;
      metric.dataValues.current_change = pricesByTicker[
        metric.dataValues.ticker
      ]
        ? pricesByTicker[metric.dataValues.ticker].change // Accessing change property
        : 0;
      metric.dataValues.current_value = pricesByTicker[metric.dataValues.ticker]
        ? pricesByTicker[metric.dataValues.ticker].price *
          metric.dataValues.current_shares
        : 0;
      metric.dataValues.return_percentage = pricesByTicker[
        metric.dataValues.ticker
      ]
        ? totalReturn(
            pricesByTicker[metric.dataValues.ticker].price,
            metric.dataValues.current_shares,
            metric.dataValues.total_invested
          )
        : 0;
      metric.dataValues.return_value = pricesByTicker[metric.dataValues.ticker]
        ? pricesByTicker[metric.dataValues.ticker].price *
            metric.dataValues.current_shares -
          metric.dataValues.total_invested
        : 0;
    });

    res.status(200).json({
      getPortfolioMetrics: filteredMetrics,
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
