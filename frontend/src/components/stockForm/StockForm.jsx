import { useEffect, useState } from 'react';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle } from 'react-icons/fa';
import moment from 'moment';
import {
  useAddTransactionMutation,
  useGetTransactionsMutation,
  useUpdateTransactionMutation,
} from '../../slices/transaction/transactionApiSlice';
import { resetStock } from '../../slices/stock/stockSlice';
import { setPortfolioMetrics } from '../../slices/portfolio/portfolioSlice';
import { useGetPortfolioMetricsMutation } from '../../slices/portfolio/portfolioApiSlice';
import { setTransactions } from '../../slices/transaction/transactionSlice';

const StockForm = () => {
  const dispatch = useDispatch();

  //Retrieves the user and stock info from redux store
  const { stockData, editStock } = useSelector((state) => state.stockData);
  const { userInfo } = useSelector((state) => state.auth);
  const { userTransactions } = useSelector((state) => state.transactionData);

  //Handles the form data
  const [shares, setShares] = useState('');
  const [type, setType] = useState('buy' || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10) || '');
  const [price, setPrice] = useState(stockData[0].price || '');

  console.log(date);
  // Updates the state of the form when editing
  useEffect(() => {
    if (editStock) {
      setPrice(parseFloat(stockData[0]?.stock_price).toFixed(2));
      setDate(moment(stockData[0]?.date).format('YYYY-MM-DD'));
      setShares(stockData[0]?.shares);
      setType(stockData[0]?.type);
    }
  }, [editStock, stockData]);

  const [errorMessage, setErrorMessage] = useState('');
  const [formVisible, setFormVisible] = useState(editStock || false);

  // Instantiates the add transation API method
  const [addTransaction, { isSuccess }] = useAddTransactionMutation();
  const [updateTransaction, { isSuccess: isSuccessAdded }] =
    useUpdateTransactionMutation();

  const [getPortolioMetrics] = useGetPortfolioMetricsMutation();

  // Gets the get transactions and portofolio API methods
  const [getTransactions] = useGetTransactionsMutation();

  // Submits the transaction
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Checks if the form cards is open, if not opens it
      if (formVisible == false) {
        setFormVisible(true);
        return;
      }
      if (!shares || !type || !date || !price) {
        setErrorMessage('All fields must be completed');
        return;
      }

      await addTransaction({
        date,
        type,
        logo_url: stockData[0].image,
        company: stockData[0].companyName,
        ticker: stockData[0].symbol,
        shares,
        stock_price: price,
        currency: stockData[0].currency,
        sector: stockData[0].sector,
        user_id: userInfo.id,
      }).unwrap();
      setErrorMessage('');
      // Requests new data from API
      const portfolio = await getPortolioMetrics().unwrap();
      dispatch(setPortfolioMetrics({ ...portfolio }));
      const transactions = await getTransactions({
        pageNumber: 1,
        sortBy: userTransactions?.sortBy,
        sortOrder: userTransactions?.sortOrder,
        searchQuery: userTransactions?.searchQuery,
      }).unwrap();
      dispatch(setTransactions({ ...transactions }));
      // Set a timeout for the successfully added animation
      setTimeout(() => {
        dispatch(resetStock());
        setPrice('');
      }, 1000);
    } catch (err) {
      if (err.data.error.type) {
        setErrorMessage(err?.data?.error.type);
      } else if (err.data.error) {
        setErrorMessage(err?.data?.error);
      } else {
        setErrorMessage('An error has occured, please try again later');
      }
    }
  };

  const editTransaction = async (e) => {
    e.preventDefault();
    try {
      if (!shares || !type || !date || !price) {
        setErrorMessage('All fields must be completed');
        return;
      }

      await updateTransaction({
        id: stockData[0].id,
        data: {
          date,
          type,
          shares,
          stock_price: price,
          ticker: stockData[0].stock.ticker,
        },
      }).unwrap();

      setErrorMessage('');
      // Requests new data from API
      const portfolio = await getPortolioMetrics().unwrap();
      dispatch(setPortfolioMetrics({ ...portfolio }));
      const transactions = await getTransactions({
        pageNumber: 1,
        sortBy: userTransactions?.sortBy,
        sortOrder: userTransactions?.sortOrder,
        searchQuery: userTransactions?.searchQuery,
      }).unwrap();
      dispatch(setTransactions({ ...transactions }));
      // Set a timeout for the successfully added animation
      setTimeout(() => {
        dispatch(resetStock());
        setPrice('');
      }, 1000);
    } catch (err) {
      if (err?.data?.error?.type) {
        setErrorMessage(err?.data?.error.type);
      } else if (err?.data?.error) {
        setErrorMessage(err?.data?.error);
      } else {
        setErrorMessage('An error has occured, please try again later');
      }
    }
  };

  return (
    <form onSubmit={editStock ? editTransaction : submitHandler}>
      {formVisible && (
        <div className='container-form-body'>
          <div className='flex'>
            <div>
              <p className='xss'>Shares</p>
              <input
                type='number'
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                step='any'
                placeholder='Ex: 2'
                className='search-box-form'
              />
            </div>
            <div>
              <p className='xss'>Type</p>
              <select
                disabled={editStock}
                value={type}
                onChange={(e) => setType(e.target.value)}
                className='search-box-form'
              >
                <option value='buy'>Buy</option>
                <option value='sell'>Sell</option>
              </select>
            </div>
          </div>
          <div className='flex'>
            <div>
              <p className='xss'>Date</p>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder='Ex: 15.02.2024'
                className='search-box-form'
              />
            </div>
            <div>
              <p className='xss'>Price</p>
              <input
                type='number'
                value={price}
                min='0'
                onChange={(e) => setPrice(e.target.value)}
                step='any'
                placeholder='Ex: 125.23'
                className='search-box-form'
              />
            </div>
          </div>
        </div>
      )}
      <div className='container-form-footer'>
        {errorMessage && <p className='error-message xs'>*{errorMessage}</p>}
        {isSuccess || isSuccessAdded ? (
          <div className='container-form-footer'>
            <FaCheckCircle size={45} color='#A3B18A' />
            <p className='alert-success light'>
              {!editStock ? 'Transaction added!' : 'Transaction Edited!'}!
            </p>
          </div>
        ) : (
          <button className='btn' type='submit'>
            {editStock
              ? 'Edit'
              : !formVisible
              ? 'Buy / Sell'
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        )}
      </div>
    </form>
  );
};

export default StockForm;
