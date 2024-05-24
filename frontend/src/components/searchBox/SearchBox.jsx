import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { getStockDataAPI } from '../../utils/apiCall';
import { setStock } from '../../slices/stock/stockSlice';
import './styles.css';
import { useGetStockDataMutation } from '../../slices/stock/stockSliceApi';

const SearchBox = () => {
  const [ticker, setTicker] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Gets the get transactions and portofolio API methods
  const [getStockData] = useGetStockDataMutation();

  // Deals with the search box form
  const searchStock = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await getStockData({ ticker }).unwrap();
      //const res = await getStockDataAPI(ticker);
      dispatch(setStock(res));
      setTicker('');
      setIsLoading(false);
    } catch (error) {
      setTicker('');
      setIsError(true);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={searchStock} className='form-search'>
        <input
          className='search_box_input'
          type='search'
          required
          maxLength={5}
          value={ticker}
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
