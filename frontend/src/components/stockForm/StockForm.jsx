import { useState } from 'react';
import './styles.css';

const StockForm = () => {
  const currentDate = new Date().toISOString().substring(0, 10);

  const [shares, setShares] = useState('');
  const [type, setType] = useState('buy');
  const [date, setDate] = useState(currentDate);
  const [price, setPrice] = useState('');
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
    } catch (err) {
      setError(err?.data?.error);
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
      )}
      <div className='container-form-footer'>
        {error && <p className='error-message xs'>*{error}</p>}
        <button className='btn' type='submit'>
          {!formVisible
            ? 'Buy / Sell'
            : type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </div>
    </form>
  );
};

export default StockForm;
