import { useSelector } from 'react-redux';
import './styles.css';

const StockInfo = () => {
  const { stockInfo: data } = useSelector((state) => state.stockData);

  if (!data || data.length === 0) {
    return (
      <div className='stock-info-container'>
        <p>No stock information available.</p>
      </div>
    );
  }

  const stock = data[0];

  return (
    <div className='stock-info-container'>
      <div>
        <p className='semi-bold smm stock-info-detail'>CEO</p>
        <p>{stock.ceo || '-'}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Site</p>
        <a href={stock.website} target='_blank' rel='noopener noreferrer'>
          {stock.website || '-'}
        </a>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Exchange</p>
        <p>{stock.exchangeShortName || '-'}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>IPO Date</p>
        <p>{stock.ipoDate || '-'}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Country</p>
        <p>{stock.country || '-'}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Company</p>
        <p>
          {stock.description
            ? stock.description.split('.').slice(0, 2).join('.') + '.'
            : '-'}
        </p>
      </div>
    </div>
  );
};

export default StockInfo;
