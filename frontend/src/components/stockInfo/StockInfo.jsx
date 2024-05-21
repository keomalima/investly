import { useSelector } from 'react-redux';
import './styles.css';

const StockInfo = () => {
  const { stockData: data } = useSelector((state) => state.stockData);

  return (
    <div className='stock-info-container'>
      <div>
        <p className='semi-bold smm stock-info-detail'>CEO</p>
        <p className=''>{!data ? '-' : data[0].ceo}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Site</p>
        <a href={data[0].website} target='blank' className=''>
          {!data ? '-' : data[0].website}
        </a>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Exchange</p>
        <p className=''>{!data ? '-' : data[0].exchange}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>IPO Date</p>
        <p className=''>{!data ? '-' : data[0].ipoDate}</p>
      </div>
      <div>
        <p className='semi-bold smm stock-info-detail'>Company</p>
        <p className=''>{!data ? '-' : data[0].description.split('.')[0]}.</p>
      </div>
    </div>
  );
};

export default StockInfo;
