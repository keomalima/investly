import './styles.css';
import { FaApple } from 'react-icons/fa';

const StockForm = () => {
  return (
    <div className='card stock-form-card'>
      <div className='container-form-header'>
        <div className='logo-flex'>
          <p className='sm strong'>Stock Quote</p>
          <FaApple size={18} />
        </div>

        <a>X</a>
      </div>
      <div className='container-form-subheader'>
        <div className='flex-column-form'>
          <p className='strong md mb'>AAPL</p>
          <p className='semi-bold'>$125.24</p>
          <p className='light xs'>Current Price</p>
        </div>
        <div className='flex-column-form'>
          <div className='flex-column-form'>
            <p className='semi-bold'>Apple Inc. </p>
            <p className='xs light mb'>Tecnology</p>
            <p className='semi-bold'>+2.3%</p>
            <p className='xs light'>Today</p>
          </div>
        </div>
      </div>
      <div className='container-form-body'>
        <div className='flex'>
          <div>
            <p>Shares</p>
            <input placeholder='Ex: 2' className='search-box-form' />
          </div>
          <div>
            <p>Type</p>
            <input placeholder='Ex: Buy' className='search-box-form' />
          </div>
        </div>
        <div className='flex'>
          <div>
            <p>Date</p>
            <input placeholder='Ex: 15.02.2024' className='search-box-form' />
          </div>
          <div>
            <p>Price</p>
            <input placeholder='Ex: 125.23' className='search-box-form' />
          </div>
        </div>
      </div>
      <div className='container-form-footer'>
        <button className='btn'>Buy / Sell</button>
      </div>
    </div>
  );
};

export default StockForm;
