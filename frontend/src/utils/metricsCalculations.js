//Calculates the metrics of the main dashboard
export function calculatePortfolioMetrics(portfolioMetrics) {
  const totalInvested = portfolioMetrics.getPortfolioMetrics.reduce(
    (acc, metric) => acc + parseFloat(metric.total_invested),
    0
  );
  const totalPortfolio = portfolioMetrics.getPortfolioMetrics.reduce(
    (acc, metric) =>
      acc + parseFloat(metric.current_shares) * metric.current_price,
    0
  );
  const profit = totalPortfolio - totalInvested;
  const portfolioReturn =
    ((totalPortfolio - totalInvested) / totalInvested) * 100;

  return { totalInvested, totalPortfolio, profit, portfolioReturn };
}
