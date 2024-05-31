import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { getStockDataAPI } from '../../utils/apiCall';
import { setStock } from '../../slices/stock/stockSlice';
import './styles.css';
import { useGetStockDataMutation } from '../../slices/stock/stockSliceApi';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [ticker, setTicker] = useState('');
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();

  const [getStockData, { isLoading }] = useGetStockDataMutation();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  // Deals with the search box form
  const searchStock = async (e) => {
    e.preventDefault();
    try {
      const res2 = await getStockData({ ticker }).unwrap();
      const res = await getStockDataAPI(ticker);
      console.log(res);
      dispatch(setStock(res));
      setTicker('');
      if (pathname.includes('stock')) navigate('/');
    } catch (error) {
      setTicker('');
      setIsError(true);
    }
  };

  return (
    <div>
      <form onSubmit={searchStock} className='form-search'>
        <input
          className='search_box_input'
          type='search'
          style={{ color: 'var(--text-color)' }}
          required
          maxLength={5}
          value={!isLoading ? ticker : 'Searching..'}
          onChange={(e) => setTicker(e.target.value)}
          placeholder={isError ? 'Error, try again later' : 'Quote a stock'}
        />
        <button className='search_box_btn' type='submit' disabled={isLoading}>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
