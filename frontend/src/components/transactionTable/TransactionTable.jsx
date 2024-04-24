import { useState } from 'react';
import transactionColumns from '../../utils/transactionColumns.json';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaPen } from 'react-icons/fa';

import './styles.css';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { useSelector } from 'react-redux';

const TransactionTable = ({
  setMetricsPerPage,
  metricsPerPage,
  setCurrentPage,
  isLoading,
  paginate,
}) => {
  // Sets the state for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Gets the data from redux store
  const { userTransactions } = useSelector((state) => state.transactionData);

  // Scrolls the view to the top when the user changes the table page
  const changePage = (number) => {
    setMetricsPerPage(number);
    paginate({ size: number });
  };

  // Displays the items per page numbers
  const itemsPerPage = [{ item: 5 }, { item: 10 }, { item: 15 }];

  // Format the price above to USD using the locale, style, and currency.
  let formatNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // States to control the order and field to sort
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

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
        <input
          type='text'
          maxLength={20}
          placeholder="Search stock symbols separeted by ','"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
          }}
        />
      </div>
      <table>
        <thead>
          <tr>
            {transactionColumns.map(({ label, accessor, sortable }) => {
              const cl = sortable ? 'default' : '';
              return (
                <th key={accessor} id={accessor} className={cl}>
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
          {userTransactions?.transactions?.rows.map((transaction, index) => (
            <tr key={transaction.id}>
              <td data-cell='#' className='metric-table-responsive xs'>
                {index + 1}
              </td>
              <td data-cell='symbol'>
                {transaction.stock.ticker ? transaction.stock.ticker : '-'}
              </td>
              <td
                data-cell='company_logo'
                className='image-filter metric-table-responsive'
              >
                <img
                  src={
                    transaction.stock.logo_url
                      ? transaction.stock.logo_url
                      : '-'
                  }
                  className='flex-center'
                />
              </td>
              <td data-cell='company' className='metric-table-responsive'>
                {!transaction.stock.company
                  ? '-'
                  : transaction.stock.company.length > 20
                  ? transaction.stock.company.slice(0, 18 - 3) + '...'
                  : transaction.stock.company}
              </td>
              <td data-cell='transaction_price' className='table-column'>
                {transaction.stock_price
                  ? formatNumber.format(transaction.stock_price)
                  : '-'}
              </td>
              <td data-cell='transaction_type'>
                {transaction.type ? transaction.type : '-'}
              </td>
              <td data-cell='transaction_shares'>{transaction.shares}</td>
              <td data-cell='transaction_total_cost'>
                {transaction.stock_price !== null || transaction.shares !== null
                  ? formatNumber.format(transaction.transaction_cost)
                  : '-'}
              </td>
              <td data-cell='transaction_date' className='table-column'>
                {transaction.date ? transaction.date : '-'}
              </td>
              <td data-cell='transaction_options' className='table-column'>
                <div className='icons-column'>
                  <TiDeleteOutline />
                  <FaPen />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
