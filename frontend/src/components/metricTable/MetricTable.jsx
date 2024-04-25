import { useSelector } from 'react-redux';
import PropagateLoader from 'react-spinners/PropagateLoader';
import './styles.css';
import { useState } from 'react';
import tableMetricsColumns from '../../utils/tableMetricColumns.json';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useFilterAndSortableTable } from '../../utils/useFilterAndSortTable';

const MetricTable = ({
  isLoading,
  indexOfFirstMetric,
  indexOfLastMetric,
  setCurrentPage,
  setMetricsPerPage,
  metricsPerPage,
  setTotalMetrics,
}) => {
  // Selects the portfolio metrics from redux state
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  // Sets the state for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Custom hook for table ordering
  const [tableData, handleFilteringAndSorting] = useFilterAndSortableTable([
    ...portfolioMetrics.getPortfolioMetrics,
  ]);

  // States to control the order and field to sort
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  // Handles the sort changes
  const handleFilteringAndSortingChange = (accessor) => {
    const sortOrder =
      accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleFilteringAndSorting(
      accessor,
      sortOrder,
      searchQuery,
      setTotalMetrics
    );
  };

  // Format the price above to USD using the locale, style, and currency.
  let formatNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Scrolls the view to the top when the user changes the table page
  const changePage = (number) => {
    setMetricsPerPage(number);
    setCurrentPage(1);
  };

  // Displays the items per page numbers
  const itemsPerPage = [{ item: 5 }, { item: 10 }, { item: 15 }];

  // Filters the metrics table
  const searchStock = async (e) => {
    e.preventDefault(e);
    handleFilteringAndSorting(false, false, searchQuery, setTotalMetrics);
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
    <div className='container-metrics-table'>
      <div>
        <div className='select-container-table'>
          <p className='xss'>Show</p>
          <select
            value={metricsPerPage}
            onChange={(e) => changePage(e.target.value)}
          >
            {itemsPerPage.map(({ item }) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
          <p className='xss'>entries</p>
        </div>
        <form onSubmit={searchStock} className='form-search'>
          <input
            type='search'
            className='search_box_input'
            maxLength={20}
            placeholder='Search stock symbols'
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              if (e.target.value === '') {
                handleFilteringAndSorting(
                  false,
                  false,
                  e.target.value,
                  setTotalMetrics
                );
              }
            }}
          />
          <button className='search_box_btn' type='submit' disabled={isLoading}>
            Search
          </button>
        </form>
      </div>

      {tableData.length == 0 && <p className='no-result xss'>No results!</p>}
      <table>
        <thead>
          <tr>
            {tableMetricsColumns.map(({ label, accessor, sortable }) => {
              const cl = sortable ? 'default' : '';
              return (
                <th
                  onClick={
                    sortable
                      ? () => handleFilteringAndSortingChange(accessor)
                      : null
                  }
                  key={accessor}
                  id={accessor}
                  className={cl}
                >
                  <div>
                    {label}
                    {sortable ? (
                      sortField === accessor && order === 'asc' ? (
                        <FaSortDown />
                      ) : sortField === accessor && order === 'desc' ? (
                        <FaSortUp />
                      ) : (
                        <FaSort />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableData
            .slice(indexOfFirstMetric, indexOfLastMetric)
            .map((metric, index) => (
              <tr key={metric.stock_id}>
                <td data-cell='#' className='metric-table-responsive xs'>
                  {index + 1}
                </td>
                <td data-cell='symbol'>
                  {metric.ticker ? metric.ticker : '-'}
                </td>
                <td className='image-filter metric-table-responsive'>
                  <img
                    src={metric.logo_url ? metric.logo_url : '-'}
                    className='flex-center'
                  />
                </td>
                <td data-cell='company' className='metric-table-responsive'>
                  {!metric.company
                    ? '-'
                    : metric.company.length > 20
                    ? metric.company.slice(0, 18 - 3) + '...'
                    : metric.company}
                </td>
                <td data-cell='price' className='table-column'>
                  {metric.current_price
                    ? formatNumber.format(metric.current_price)
                    : '-'}
                  <span
                    className='xs'
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
                <td data-cell='return' className='table-column'>
                  {metric.return_percentage !== null
                    ? metric.return_percentage
                    : '0'}
                  %
                  <span
                    className='xs'
                    style={{
                      color:
                        Math.abs(metric.current_change) < 1e-10 ||
                        metric.current_change >= 0
                          ? 'rgba(163, 177, 138, 1)'
                          : 'rgba(200, 68, 60, 1)',
                    }}
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
    </div>
  );
};

export default MetricTable;
