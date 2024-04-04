import { getMetrics } from '../utils/porfolioMetrics.js';

// @desc Obtains portfolio metrics
// @route GET /api/portfolio
// @access Private
const getPortfolio = async (req, res) => {
  try {
    const getPortfolioMetrics = await getMetrics(req.user.id);
    res.status(201).json({
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
