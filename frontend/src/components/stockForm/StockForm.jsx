import { useState } from 'react';
import './styles.css';
import { FaApple } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';

const StockForm = () => {
  const currentDate = new Date().toISOString().substring(0, 10);

  const [shares, setShares] = useState('');
  const [type, setType] = useState('buy');
  const [date, setDate] = useState(currentDate);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [cardStyle, setCardStyle] = useState('hide-stock-card');
  const [bodyStyle, setBodyStyle] = useState('hide-stock-card');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (bodyStyle == 'hide-stock-card') {
        setBodyStyle('container-form-body');
        return;
      }
      if (!shares || !type || !date || !price) {
        setError('All fields must be completed');
        return;
      }
    } catch (err) {
      setError(err?.data?.error);
    }
  };

  const hideCard = () => {
    setCardStyle('hide-stock-card');
  };

  return (
    <div className={`${cardStyle} card`}>
      <div className='container-form-header'>
        <div className='logo-flex'>
          <p className='sm strong'>Stock Quote</p>
          <FaApple size={18} />
        </div>
        <IoIosClose onClick={hideCard} />
      </div>
      <form onSubmit={submitHandler}>
        <div className='container-form-subheader'>
          <div className='flex-column-form'>
            <p className='strong md mb'>AAPL</p>
            <p className='semi-bold'>$125.24</p>
            <p className='light xs'>Current Price</p>
          </div>
          <div className='flex-column-form'>
            <div className='flex-column-form'>
              <p className='semi-bold'>Apple Inc. </p>
              <p className='xs light mb'>Tecnology</p>
              <p className='semi-bold'>+2.3%</p>
              <p className='xs light'>Today</p>
            </div>
          </div>
        </div>
        <div className={`${bodyStyle}`}>
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
                onChange={(e) => setPrice(e.target.value)}
                step='any'
                placeholder='Ex: 125.23'
                className='search-box-form'
              />
            </div>
          </div>
        </div>
        <div className='container-form-footer'>
          {error && <p className='error-message xs'>*{error}</p>}
          <button className='btn' type='submit'>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockForm;
