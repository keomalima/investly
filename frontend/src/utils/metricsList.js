export function metricsList(metrics) {
  // Calculates the return of investement
  const totalReturn = (current_price, shares, total_invested) => {
    const current_value = current_price * shares;
    const result = ((current_value - total_invested) / total_invested) * 100;
    return Math.abs(result) < 1e-10 ? 0 : result.toFixed(2);
  };

  const calculatedMetrics = {};

  // Creates a new array with calculated metrics
  metrics.forEach((metric) => {
    calculatedMetrics[metric.ticker] = {
      current_value: metric.current_shares * metric.current_price,
      return_percentage: totalReturn(
        metric.current_price,
        metric.current_shares,
        metric.total_invested
      ),
      return_value:
        metric.current_shares * metric.current_price - metric.total_invested,
    };
  });

  const modifiedMetrics = metrics.map((metric) => {
    return {
      ...metric,
      current_value: calculatedMetrics[metric.ticker]
        ? calculatedMetrics[metric.ticker].current_value
        : 0,
      return_percentage: calculatedMetrics[metric.ticker]
        ? calculatedMetrics[metric.ticker].return_percentage
        : 0,
      return_value: calculatedMetrics[metric.ticker]
        ? calculatedMetrics[metric.ticker].return_value
        : 0,
    };
  });

  return modifiedMetrics;
}
