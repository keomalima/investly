import './styles.css';
import { RiStockLine } from 'react-icons/ri';

const MetricCard = () => {
  return (
    <div className='card metric-container'>
      <div className='grid'>
        <div>
          <p className='sm medium'>Total Profit/Loss</p>
          <h1 className='md semi-bold digit-animation'>$9,525.15</h1>
          <p className='xs light'>+20.1% from last month</p>
        </div>
        <div className='icon-card-container'>
          <RiStockLine size={25} />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
