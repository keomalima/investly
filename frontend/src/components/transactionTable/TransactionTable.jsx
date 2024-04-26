import { useState } from 'react';
import transactionColumns from '../../utils/transactionColumns.json';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaPen } from 'react-icons/fa';
import './styles.css';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { useDispatch, useSelector } from 'react-redux';
import { editStock } from '../../slices/stock/stockSlice';
import { deleteTransaction } from '../../slices/transaction/transactionSlice';
import { useDeleteTransactionMutation } from '../../slices/transaction/transactionApiSlice';
import { FaCheckCircle } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

const TransactionTable = ({
  setMetricsPerPage,
  metricsPerPage,
  isLoading,
  paginate,
}) => {
  // Gets the data from redux store
  const { userTransactions } = useSelector((state) => state.transactionData);

  const dispatch = useDispatch();

  // Sets the state for the search query
  const [searchQuery, setSearchQuery] = useState(
    userTransactions?.searchQuery || ''
  );

  // States to control the order and field to sort
  const [sortField] = useState(userTransactions?.sortBy);
  const [order] = useState(userTransactions?.sortOrder);
  const [isError, setIsError] = useState(false);

  // Controls delete state
  const [isDelete, setIsDelete] = useState({ id: null, state: false });

  // Delete method
  const [deleteTransactionAPI, { isSuccess, error }] =
    useDeleteTransactionMutation();

  // Scrolls the view to the top when the user changes the table page
  const changePage = (number) => {
    setMetricsPerPage(number);
    paginate({ size: number });
  };

  const handleSortingChange = (accessor) => {
    const sortOrder =
      accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    paginate({ sortBy: accessor, sortOrder });
  };

  // Displays the items per page numbers
  const itemsPerPage = [{ item: 5 }, { item: 10 }, { item: 15 }];

  // Format the price above to USD using the locale, style, and currency.
  let formatNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const searchStock = async (e) => {
    e.preventDefault();
    try {
      paginate({ searchQuery: searchQuery.toUpperCase() });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id) => {
    setIsDelete({ id, state: true });
    setTimeout(() => {
      setIsDelete({ id: null, state: false });
    }, 3000);
  };

  // Handles the delete transaction method
  const handleDelete = async (id) => {
    try {
      await deleteTransactionAPI({
        id,
      }).unwrap();
      setIsDelete({ id, state: false });
      setTimeout(() => {
        dispatch(deleteTransaction(id));
      }, 1000);
    } catch (error) {
      setIsError(true);
      setIsDelete({ id, state: false });
      setTimeout(() => {
        setIsError(false);
      }, 4000);
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
    <div className='container-metrics-table'>
      <div>
        <div className='select-container-table'>
          <p className='xss'>Show</p>
          <select
            value={metricsPerPage}
            onChange={(e) => changePage(e.target.value)}
          >
            {itemsPerPage?.map(({ item }) => {
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
            className='search_box_input'
            type='search'
            maxLength={20}
            placeholder='Search stock symbols'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === '') {
                paginate({ searchQuery: e.target.value });
              }
            }}
          />
          <button className='search_box_btn' type='submit' disabled={isLoading}>
            Search
          </button>
        </form>
      </div>
      {userTransactions?.transactions?.rows?.length == 0 && (
        <p className='no-result xss'>No results!</p>
      )}
      <table>
        <thead>
          <tr>
            {transactionColumns?.map(({ label, accessor, sortable }) => {
              const cl = sortable ? 'default' : '';
              return (
                <th
                  onClick={
                    sortable ? () => handleSortingChange(accessor) : null
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
          {userTransactions?.transactions?.rows.map((transaction, index) => (
            <tr key={transaction.id}>
              <td data-cell='index' className='metric-table-responsive xs'>
                {index + 1}
              </td>
              <td data-cell='symbol'>
                {transaction?.stock.ticker ? transaction.stock.ticker : '-'}
              </td>
              <td
                data-cell='company_logo'
                className='image-filter metric-table-responsive'
              >
                <img
                  src={
                    transaction?.stock.logo_url
                      ? transaction.stock.logo_url
                      : '-'
                  }
                  className='flex-center'
                />
              </td>
              <td data-cell='company' className='metric-table-responsive'>
                {!transaction?.stock.company
                  ? '-'
                  : transaction.stock.company.length > 20
                  ? transaction.stock.company.slice(0, 18 - 3) + '...'
                  : transaction.stock.company}
              </td>
              <td data-cell='transaction_type'>
                <p
                  className={
                    transaction?.type === 'buy'
                      ? 'transaction-type transaction-type-buy'
                      : 'transaction-type transaction-type-sell'
                  }
                >
                  {transaction.type ? transaction.type : '-'}
                </p>
              </td>
              <td data-cell='transaction_price' className='table-column'>
                {transaction?.stock_price
                  ? formatNumber.format(transaction.stock_price)
                  : '-'}
              </td>

              <td data-cell='transaction_shares'>{transaction.shares}</td>
              <td data-cell='transaction_cost'>
                {transaction?.transaction_cost
                  ? formatNumber.format(transaction.transaction_cost)
                  : '-'}
              </td>
              <td data-cell='transaction_date' className='table-column'>
                {transaction?.date ? transaction.date : '-'}
              </td>
              <td data-cell='transaction_options' className='table-column'>
                {isDelete.state && transaction.id === isDelete.id ? (
                  <div className='delete-item-container'>
                    <p className='light xs semi-bold'>Are you sure?</p>
                    <div className='delete-items'>
                      <a
                        className='xs  edit-icons edit-icon'
                        onClick={() => setIsDelete({ id: null, state: false })}
                      >
                        Cancel
                      </a>
                      <a
                        className='xs  semi-bold edit-icons error-message delete-icon'
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                ) : transaction.id === isDelete.id && isSuccess ? (
                  <div className='flex'>
                    <FaCheckCircle size={25} color='#A3B18A' />
                  </div>
                ) : transaction.id === isDelete.id && isError ? (
                  <div className='flex-column'>
                    <TiDelete
                      size={25}
                      color='rgba(200, 68, 60, 1)'
                      onClick={() => setIsError(false)}
                      className='edit-icons delete-icon'
                    />
                    <p className=' light xs error-message'>
                      {error?.data?.error
                        ? "You don't have enough shares to delete this transaction."
                        : 'An error has occured'}
                    </p>
                  </div>
                ) : (
                  <div className='icons-column'>
                    <TiDeleteOutline
                      size={18}
                      className={'edit-icons delete-icon'}
                      onClick={() => confirmDelete(transaction.id)}
                    />
                    <FaPen
                      className={'edit-icons edit-icon'}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        });
                        dispatch(editStock([transaction]));
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className='metric-table-responsive'></td>
            <td className='metric-table-responsive'></td>
            <td className='metric-table-responsive'></td>
            <td></td>
            <th scope='row'>Totals:</th>
            <td className='semi-bold'>
              {formatNumber?.format(
                userTransactions?.transactions?.rows.reduce(
                  (acc, total) => acc + parseFloat(total.stock_price),
                  0
                )
              )}
            </td>
            <td className='semi-bold'>
              {userTransactions?.transactions?.rows.reduce(
                (acc, total) => acc + parseFloat(total.shares),
                0
              )}
            </td>
            <td className='semi-bold'>
              {formatNumber.format(
                userTransactions?.transactions?.rows.reduce(
                  (acc, total) => acc + parseFloat(total.transaction_cost),
                  0
                )
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
