import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { openStockForm } from '../../slices/stock/stockSlice';

const StockPrice = () => {
  const dispatch = useDispatch();

  const { stockData: data } = useSelector((state) => state.stockData);

  return (
    <div className='stock-price-container-column'>
      <div className='stock-price-container'>
        <p className='md strong'>{data ? data[0]?.symbol : '-'}</p>
        {data ? (
          <img
            className='image-logo'
            width='25'
            src={data[0].image || '/'}
            alt='Company Logo'
          />
        ) : (
          <p>-</p>
        )}
      </div>
      <div className='stock-price-container'>
        <div>
          <p className='xss strong'>
            {!data
              ? '-'
              : data[0]?.companyName.length > 16
              ? data[0]?.companyName.slice(0, 16 - 3) + '..'
              : data[0]?.companyName}
          </p>
          <p className='xss light my-1-xs'>{!data ? '-' : data[0]?.sector}</p>
        </div>
        <div>
          <div className='stock-price-inner-container'>
            <p className='xss strong'>{!data ? '-' : '$' + data[0]?.price}</p>
            <p className='xs medium'>({!data ? '-' : data[0]?.changes})</p>
          </div>
          <p className='xss light my-1-xs'>Current Price</p>
        </div>
      </div>
      <div className='stock-price-btn-container'>
        <button onClick={() => dispatch(openStockForm())} className='btn'>
          Buy / Sell
        </button>
      </div>
    </div>
  );
};

export default StockPrice;
