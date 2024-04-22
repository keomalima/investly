import { useSelector } from 'react-redux';
import PropagateLoader from 'react-spinners/PropagateLoader';
import './styles.css';
import { sortTable } from '../../utils/sortableTable';

const MetricTable = ({ isLoading, indexOfFirstMetric, indexOfLastMetric }) => {
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
    const result = ((current_value - total_invested) / total_invested) * 100;
    return Math.abs(result) < 1e-10 ? 0 : result.toFixed(2);
  };

  const limitSringSize = (str) => {
    if (str.length > 25) {
      return str.slice(0, 25 - 3) + '...';
    } else {
      return str;
    }
  };

  const styleCheck = (current_price, shares, total_invested) => {
    if (
      Math.abs(current_price * shares - total_invested) < 1e-10 ||
      current_price * shares - total_invested >= 0
    ) {
      return { color: 'rgba(163, 177, 138, 1)' }; // Return green color if profit
    } else {
      return { color: 'rgba(200, 68, 60, 1)' }; // Return red color if loss
    }
  };

  // Returns a loader if data is not ready
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
        {portfolioMetrics.getPortfolioMetrics
          .slice(indexOfFirstMetric, indexOfLastMetric)
          .map((metric, index) => (
            <tr key={metric.stock_id}>
              <td data-cell='#'>{index + 1}</td>
              <td data-cell='symbol'>{metric.ticker ? metric.ticker : '-'}</td>
              <td>
                <img
                  src={metric.logo_url ? metric.logo_url : '-'}
                  className='image-logo flex'
                />
              </td>
              <td data-cell='company'>
                {metric.company ? limitSringSize(metric.company) : '-'}
              </td>
              <td data-cell='price'>
                {metric.current_price
                  ? formatNumber.format(metric.current_price)
                  : '-'}
                <span
                  className='xss'
                  style={{
                    color:
                      metric.current_change >= 0
                        ? 'rgba(163, 177, 138, 1)'
                        : 'rgba(200, 68, 60, 1)',
                  }}
                >
                  {' '}
                  (
                  {metric.current_change
                    ? metric.current_change.toFixed(2)
                    : '-'}
                  )
                </span>
              </td>
              <td data-cell='shares'>{metric.current_shares}</td>
              <td data-cell='value' className='semi-bold'>
                {formatNumber.format(
                  metric.current_price * metric.current_shares
                )}
              </td>
              <td data-cell='cost'>
                {metric.total_invested
                  ? formatNumber.format(metric.total_invested)
                  : '-'}
              </td>
              <td data-cell='avg price'>
                {metric.average_price
                  ? formatNumber.format(metric.average_price)
                  : '-'}
              </td>
              <td data-cell='return'>
                {metric.current_price &&
                metric.current_shares &&
                metric.total_invested
                  ? totalReturn(
                      metric.current_price,
                      metric.current_shares,
                      metric.total_invested
                    )
                  : '-'}
                %
                <span
                  className='xss'
                  style={styleCheck(
                    metric.current_price,
                    metric.current_shares,
                    metric.total_invested
                  )}
                >
                  {' '}
                  (
                  {metric.current_price &&
                  metric.current_shares &&
                  metric.total_invested
                    ? Math.abs(
                        metric.current_price * metric.current_shares -
                          metric.total_invested
                      ) < 1e-10
                      ? formatNumber.format(0)
                      : formatNumber.format(
                          metric.current_shares * metric.current_price -
                            metric.total_invested
                        )
                    : '-'}
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
