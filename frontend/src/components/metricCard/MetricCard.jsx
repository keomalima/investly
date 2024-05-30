import './styles.css';
import { RiStockLine } from 'react-icons/ri';
import { LiaMoneyBillWaveAltSolid } from 'react-icons/lia';
import { AiOutlineStock } from 'react-icons/ai';
import { AiOutlinePercentage } from 'react-icons/ai';
import PropagateLoader from 'react-spinners/PropagateLoader';

const MetricCard = ({ title, value, isLoading }) => {
  // Format the price above to USD using the locale, style, and currency.
  let formatNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Dinamically choses the icon for each card
  const icon = () => {
    switch (title) {
      case 'Total Profit':
        return <RiStockLine size={23} />;
      case 'Portfolio Value':
        return <LiaMoneyBillWaveAltSolid size={25} />;
      case 'Total Invested':
        return <AiOutlineStock size={25} />;
      case 'Return':
        return <AiOutlinePercentage />;
      default:
        return <RiStockLine size={25} />;
    }
  };

  return (
    <div className='card metric-container'>
      {!isLoading ? (
        <div className='grid'>
          <div>
            <p className='sm medium'>{title}</p>
            {title == 'Return' ? (
              <h1 className='md semi-bold digit-animation'>
                {value?.toFixed(2)}%
              </h1>
            ) : (
              <h1 className='md semi-bold digit-animation'>
                {formatNumber.format(value)}
              </h1>
            )}
          </div>
          <div className='icon-card-container'>{icon()}</div>
        </div>
      ) : (
        <div className='flex-center'>
          <PropagateLoader
            color='var(--text-color)'
            cssOverride={{ margin: '40px' }}
            size={10}
          />
        </div>
      )}
    </div>
  );
};

export default MetricCard;
