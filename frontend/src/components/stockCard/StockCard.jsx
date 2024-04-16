import './styles.css';
import './styles.css';
import { FaApple } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import StockForm from '../stockForm/StockForm';
import { resetStock } from '../../slices/stock/stockSlice';

const StockCard = () => {
  const { stockData } = useSelector((state) => state.stockData);
  const dispatch = useDispatch();

  const closeCard = () => {
    dispatch(resetStock());
  };

  return (
    <div className={'stock-form-card card'}>
      <div className='container-form-header'>
        <div className='logo-flex'>
          <p className='sm strong'>Stock Quote</p>
          <FaApple size={18} />
        </div>
        <IoIosClose className='btn-outline' onClick={closeCard} size={25} />
      </div>
      <div className='container-form-subheader'>
        <div className='flex-column-form'>
          <p className='strong md mb'>
            {stockData ? stockData[0].ticker : 'AAPL'}
          </p>
          <p className='semi-bold'>{stockData ? stockData[0].price : 0}</p>
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
      <StockForm />
    </div>
  );
};

export default StockCard;
