export function getPortolioMetrics(transactions) {
  // Filter for transactions with type 'buy'
  const bought_shares = transactions.filter(
    (transaction) => transaction.dataValues.type === 'buy'
  );

  if (bought_shares.length === 0) {
    return { averagePrice: 0, total_current_share: 0 };
  }

  const sold_shares = transactions.filter(
    (transaction) => transaction.dataValues.type === 'sell'
  );

  const weightedPrices = bought_shares.map((transaction) => {
    return (
      parseFloat(transaction.dataValues.shares) *
      parseFloat(transaction.dataValues.stock_price)
    );
  });

  const total_bought_shares = bought_shares.reduce(
    (acc, transaction) => acc + parseFloat(transaction.dataValues.shares),
    0
  );

  const total_sold_shares = sold_shares.reduce(
    (acc, transaction) => acc + parseFloat(transaction.dataValues.shares),
    0
  );

  const total_cost = bought_shares.reduce(
    (acc, transaction) => acc + parseFloat(transaction.dataValues.stock_price),
    0
  );

  const averagePrice = total_cost / total_bought_shares;
  const total_current_shares = total_bought_shares - total_sold_shares;

  return { averagePrice, total_current_shares };
}
