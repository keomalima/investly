import { useState } from 'react';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle } from 'react-icons/fa';
import { useAddTransactionMutation } from '../../slices/transaction/transactionApiSlice';
import { resetStock } from '../../slices/stock/stockSlice';

const StockForm = () => {
  const currentDate = new Date().toISOString().substring(0, 10);

  const stockDat = [
    {
      symbol: 'AAPL',
      price: 172.69,
      companyName: 'Apple Inc.',
      currency: 'USD',
      sector: 'Technology',
      image: 'https://financialmodelingprep.com/image-stock/AAPL.png',
    },
  ];

  const { stockData } = useSelector((state) => state.stockData);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addTransaction, { isLoading, isSuccess, isError }] =
    useAddTransactionMutation();

  const [shares, setShares] = useState('');
  const [type, setType] = useState('buy');
  const [date, setDate] = useState(currentDate);
  const [price, setPrice] = useState(
    stockData.length > 0 ? stockData[0].price : ''
  );
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(false);

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
        setError('All fields must be completed');
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
        user_id: userInfo.id,
      }).unwrap();
      setError('');
      setTimeout(() => {
        dispatch(resetStock());
      }, 1300);
    } catch (err) {
      if (err.data.error) {
        setError(err?.data?.error);
      } else {
        setError('An error has occured, please try again later');
      }
    }
  };

  return (
    <form onSubmit={submitHandler}>
      {formVisible && (
        <div className='container-form-body'>
          <div className='flex'>
            <div>
              <p className='xss'>Shares</p>
              <input
                type='number'
                min='0'
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
        {error && <p className='error-message xs'>*{error}</p>}
        {isSuccess ? (
          <div className='container-form-footer'>
            <FaCheckCircle size={45} color='#A3B18A' />
            <p className='alert-success light'>Transaction added!</p>
          </div>
        ) : (
          <button className='btn' type='submit'>
            {!formVisible
              ? 'Buy / Sell'
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        )}
      </div>
    </form>
  );
};

export default StockForm;
