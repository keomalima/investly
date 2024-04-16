import { useSelector } from 'react-redux';
import './styles.css';
import { RiStockLine } from 'react-icons/ri';

const MetricCard = ({ title }) => {
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  return (
    <div className='card metric-container'>
      <div className='grid'>
        <div>
          <p className='sm medium'>{title}</p>
          <h1 className='md semi-bold digit-animation'></h1>
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
