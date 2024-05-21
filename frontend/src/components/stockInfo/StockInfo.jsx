import { useSelector } from 'react-redux';
import './styles.css';

const StockInfo = () => {
  const { stockInfo: data } = useSelector((state) => state.stockData);

  return (
    <div className='stock-info-container'>
      <div>
        <p className='semi-bold smm stock-info-detail'>CEO</p>
        <p className=''>{!data.length > 0 ? '-' : data[0].ceo}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Site</p>
        <a href={data[0].website} target='blank' className=''>
          {!data.length > 0 ? '-' : data[0].website}
        </a>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Exchange</p>
        <p className=''>{!data.length > 0 ? '-' : data[0].exchangeShortName}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>IPO Date</p>
        <p className=''>{!data.length > 0 ? '-' : data[0].ipoDate}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Country</p>
        <p className=''>{!data.length > 0 ? '-' : data[0].country}</p>
      </div>

      <div>
        <p className='semi-bold smm stock-info-detail'>Company</p>
        <p className=''>
          {!data.length > 0
            ? '-'
            : data[0].description.split('.')[0] +
              '.' +
              data[0].description.split('.')[1]}
          .
        </p>
      </div>
    </div>
  );
};

export default StockInfo;
