import { useSelector } from 'react-redux';
import './style.css';

const StockPrice = () => {
  const { stockData: data } = useSelector((state) => state.stockData);

  return (
    <div className='stock-price-container-column'>
      <div className='stock-price-container'>
        <p className='md strong'>{data[0]?.symbol}</p>
        <img
          className='image-logo'
          width='25'
          src={data[0].image}
          alt='Company Logo'
        />
      </div>
      <div className='stock-price-container'>
        <div>
          <p className='xss strong'>
            {!data[0]?.companyName
              ? '-'
              : data[0]?.companyName.length > 15
              ? data[0]?.companyName.slice(0, 18 - 3) + '..'
              : data[0]?.companyName}
          </p>
          <p className='xss light my-1-xs'>
            {!data[0].sector ? '-' : data[0]?.sector}
          </p>
        </div>
        <div>
          <div className='stock-price-inner-container'>
            <p className='xss strong'>
              {!data[0]?.price ? '-' : '$' + data[0]?.price}
            </p>
            <p className='xs medium'>
              ({!data[0]?.changes ? '-' : data[0]?.changes})
            </p>
          </div>
          <p className='xss light my-1-xs'>Current Price</p>
        </div>
      </div>
      <div className='stock-price-btn-container'>
        <button className='btn'>Buy</button>
        <button className='btn'>Sell</button>
      </div>
    </div>
  );
};

export default StockPrice;
