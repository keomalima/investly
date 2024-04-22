import { useSelector } from 'react-redux';
import PropagateLoader from 'react-spinners/PropagateLoader';
import './styles.css';
import { useState } from 'react';
import { metricsList } from '../../utils/metricsList';
import { useSortableTable } from '../../utils/useSortableTable';
import { FaSort } from 'react-icons/fa';

const MetricTable = ({ isLoading, indexOfFirstMetric, indexOfLastMetric }) => {
  // Selects the portfolio metrics from redux state
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  // Custom hook for table ordering
  const [tableData, handleSorting] = useSortableTable([
    ...portfolioMetrics.getPortfolioMetrics,
  ]);

  // States to control the order and field to sort
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  // Defines the table columns
  const tableColumns = [
    { label: '#', accessor: '#', sortable: false },
    { label: 'Symbol', accessor: 'ticker', sortable: true },
    { label: '', accessor: '', sortable: false },
    { label: 'Company', accessor: 'company', sortable: true },
    { label: 'Current Price', accessor: 'current_price', sortable: true },
    { label: 'Shares', accessor: 'current_shares', sortable: true },
    { label: 'Port. Value', accessor: 'current_value', sortable: true },
    { label: 'Tot. Invested', accessor: 'total_invested', sortable: true },
    { label: 'Avg. Price', accessor: 'average_price', sortable: true },
    { label: 'Return', accessor: 'return_percentage', sortable: true },
  ];

  // Handles the sort changes
  const handleSortingChange = (accessor) => {
    console.log(accessor);
    const sortOrder =
      accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  // Format the price above to USD using the locale, style, and currency.
  let formatNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Limits the string size of the strings
  const limitSringSize = (str) => {
    if (str.length > 25) {
      return str.slice(0, 25 - 3) + '...';
    } else {
      return str;
    }
  };

  // Styles the results depending if they are positive or negative
  const styleCheck = (value) => {
    if (Math.abs(value) < 1e-10 || value >= 0) {
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
          {tableColumns.map(({ label, accessor, sortable }) => {
            const cl = sortable
              ? sortField === accessor && order === 'asc'
                ? 'up'
                : sortField === accessor && order === 'desc'
                ? 'down'
                : 'default'
              : '';
            return (
              <th
                onClick={sortable ? () => handleSortingChange(accessor) : null}
                key={accessor}
                className={cl}
              >
                {label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {metricsList(tableData)
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
                  {metric.current_change !== null
                    ? metric.current_change.toFixed(2)
                    : '-'}
                  )
                </span>
              </td>
              <td data-cell='shares'>{metric.current_shares}</td>
              <td data-cell='value' className='semi-bold'>
                {metric.current_value !== null
                  ? formatNumber.format(metric.current_value)
                  : '-'}
              </td>
              <td data-cell='cost'>
                {metric.total_invested !== null
                  ? formatNumber.format(metric.total_invested)
                  : '-'}
              </td>
              <td data-cell='avg price'>
                {metric.average_price !== null
                  ? formatNumber.format(metric.average_price)
                  : '-'}
              </td>
              <td data-cell='return'>
                {metric.return_percentage !== null
                  ? metric.return_percentage
                  : '0'}
                %
                <span
                  className='xss'
                  style={styleCheck(metric.return_percentage)}
                >
                  {' '}
                  (
                  {metric.return_value !== null
                    ? Math.abs(metric.return_value) < 1e-10
                      ? formatNumber.format(0)
                      : formatNumber.format(metric.return_value)
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
