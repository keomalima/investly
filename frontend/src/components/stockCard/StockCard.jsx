import './styles.css';
import { IoIosClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import StockForm from '../stockForm/StockForm';
import { resetStock } from '../../slices/stock/stockSlice';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const StockCard = () => {
  const dispatch = useDispatch();

  //Retrieves the stock data from redux store
  const { stockData, editStock } = useSelector((state) => state.stockData);

  //Limit company name size
  const limitSringSize = (str) => {
    if (str.length > 25) {
      return str.slice(0, 25 - 3) + '...';
    } else {
      return str;
    }
  };

  // Resets the original state of the card
  const closeCard = () => {
    dispatch(resetStock());
  };

  return (
    <div className={'stock-form-card card'}>
      {stockData.length > 0 ? (
        <div>
          <div className='container-form-header'>
            <div className='logo-flex'>
              {!editStock ? (
                <p className='sm strong'>Stock Quote</p>
              ) : (
                <p className='sm strong'>Edit Transaction</p>
              )}
              {stockData.length > 0 && (
                <img
                  src={
                    !editStock
                      ? stockData[0]?.image
                      : stockData[0]?.stock.logo_url
                  }
                  className='image-logo'
                />
              )}
            </div>
            <IoIosClose className='btn-outline' onClick={closeCard} size={25} />
          </div>
          <div className='container-form-subheader'>
            <div>
              {!editStock ? (
                <Link to={`/stock/${stockData[0]?.symbol}`}>
                  <div className='stock-ticker-link'>
                    <p className='strong md mb'>{stockData[0]?.symbol}</p>
                    <FaExternalLinkAlt
                      size={11}
                      className='table-link-icon mb'
                    />
                  </div>
                </Link>
              ) : (
                <Link to={`/stock/${stockData[0]?.stock.ticker}`}>
                  <p className='strong md mb'>{stockData[0]?.stock.ticker}</p>
                </Link>
              )}

              {!editStock && (
                <>
                  <p className='semi-bold'>${stockData[0]?.price}</p>
                  <p className='light xs'>Current Price</p>
                </>
              )}
            </div>
            <div className='flex-column-form'>
              <p className='semi-bold'>
                {!editStock
                  ? limitSringSize(stockData[0]?.companyName)
                  : limitSringSize(stockData[0].stock?.company)}
              </p>
              <p className='xs light mb'>
                {!editStock ? stockData[0]?.sector : stockData[0]?.stock.sector}
              </p>
              {!editStock && (
                <>
                  <p className='semi-bold'>
                    ${!editStock ? stockData[0]?.changes : '-'}
                  </p>
                  <p className='xs light'>Today</p>
                </>
              )}
            </div>
          </div>
          <StockForm />
        </div>
      ) : (
        <div className='flex-center'>
          <p className='error-message'>Stock not found, try another one.</p>
          <IoIosClose className='btn-outline' onClick={closeCard} size={25} />
        </div>
      )}
    </div>
  );
};

export default StockCard;
