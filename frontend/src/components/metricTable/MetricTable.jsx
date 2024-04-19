import { useSelector } from 'react-redux';
import PropagateLoader from 'react-spinners/PropagateLoader';
import './styles.css';

const MetricTable = ({ isLoading }) => {
  // Selects the portfolio metrics from redux state
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  // Format the price above to USD using the locale, style, and currency.
  let formatNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Calculates the return of investement
  const totalReturn = (current_price, shares, total_invested) => {
    const current_value = current_price * shares;
    return ((current_value - total_invested) / total_invested) * 100;
  };

  if (isLoading) {
    return (
      <div className='flex-center'>
        <PropagateLoader
          color='#000000'
          cssOverride={{ margin: '40px' }}
          size={10}
        />
      </div>
    );
  }

  return (
    <table className='content-metrics-table'>
      <thead>
        <tr>
          <th>#</th>
          <th>Symbol</th>
          <th></th>
          <th>Company</th>
          <th>Current Price</th>
          <th>Shares</th>
          <th>Port. Value</th>
          <th>Tot. Invested</th>
          <th>Avg. Price</th>
          <th>Inv. Return</th>
        </tr>
      </thead>
      <tbody>
        {portfolioMetrics.getPortfolioMetrics.map((metric, index) => (
          <tr key={metric.stock_id}>
            <td data-cell='#'>{index + 1}</td>
            <td data-cell='symbol'>{metric.ticker}</td>
            <td>
              <img src={metric.logo_url} width={20} />
            </td>
            <td data-cell='company'>{metric.company}</td>
            <td data-cell='price'>
              {formatNumber.format(metric.current_price)}
              <span className='light xs'> ({metric.current_change})</span>
            </td>
            <td data-cell='shares'>{metric.current_shares}</td>
            <td data-cell='value'>
              {formatNumber.format(
                metric.current_price * metric.current_shares
              )}
            </td>
            <td data-cell='cost'>
              {formatNumber.format(metric.total_invested)}
            </td>
            <td data-cell='avg price'>
              {formatNumber.format(metric.average_price)}
            </td>
            <td data-cell='return'>
              {totalReturn(
                metric.current_price,
                metric.current_shares,
                metric.total_invested
              ).toFixed(2)}
              %
              <span className='light xs'>
                {' '}
                (
                {formatNumber.format(
                  metric.current_price * metric.current_shares -
                    metric.total_invested
                )}
                )
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MetricTable;
