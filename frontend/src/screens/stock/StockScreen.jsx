import Navbar from '../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import moment from 'moment';
import './styles.css';
import StockChart from '../../components/stockChart/StockChart';
import { getStockDataChartAPI } from '../../utils/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { setStockChartData } from '../../slices/stock/stockSlice';
import { useLocation } from 'react-router-dom';
import PropagateLoader from 'react-spinners/PropagateLoader';
import SyncLoader from 'react-spinners/SyncLoader';
import { FaLongArrowAltUp } from 'react-icons/fa';
import { FaLongArrowAltDown } from 'react-icons/fa';

const StockScreen = () => {
  const dispatch = useDispatch();

  //Get the ticker from the URL
  const { pathname } = useLocation();
  const ticker = pathname.split('/');

  const [initialLoad, setInitialLoad] = useState(true);
  const [fetchLoad, setFetchLoad] = useState(true);
  const [dateFilter, setDateFilter] = useState('5d');
  const [timeFrame, setTimeFrame] = useState('30min');
  const [dateFrom, setDateFrom] = useState(
    moment().subtract(5, 'days').format('YYYY-MM-DD')
  );
  const [dateTo, setDateTo] = useState(
    moment().subtract(1, 'days').format('YYYY-MM-DD')
  );

  const { stockChartData: data } = useSelector((state) => state.stockData);

  useEffect(() => {
    fetchHistoricalData(ticker[ticker.length - 1], dateFrom, dateTo, timeFrame);
  }, []);

  const fetchHistoricalData = async (symbol, from, to, interval) => {
    try {
      const res = await getStockDataChartAPI(symbol, from, to, interval);
      if (res) {
        dispatch(setStockChartData(res));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInitialLoad(false);
      setFetchLoad(false);
    }
  };

  const changeFilter = (range) => {
    setFetchLoad(true);
    if (range === '5d') {
      setDateFrom(moment().subtract(5, 'days').format('YYYY-MM-DD'));
      setDateTo(moment().subtract(1, 'days').format('YYYY-MM-DD'));
      setTimeFrame('30min');
      setDateFilter('5d');
      fetchHistoricalData(
        ticker[ticker.length - 1],
        moment().subtract(5, 'days').format('YYYY-MM-DD'),
        moment().subtract(1, 'days').format('YYYY-MM-DD'),
        '30min'
      );
    } else if (range === '1m') {
      setDateFrom(moment().subtract(30, 'days').format('YYYY-MM-DD'));
      setDateTo(moment().subtract(1, 'days').format('YYYY-MM-DD'));
      setTimeFrame('4hour');
      setDateFilter('1m');
      fetchHistoricalData(
        ticker[ticker.length - 1],
        moment().subtract(30, 'days').format('YYYY-MM-DD'),
        moment().subtract(1, 'days').format('YYYY-MM-DD'),
        '4hour'
      );
    } else {
      setDateFrom(moment().subtract(180, 'days').format('YYYY-MM-DD'));
      setDateTo(moment().subtract(1, 'days').format('YYYY-MM-DD'));
      setTimeFrame('4hour');
      setDateFilter('6m');
      fetchHistoricalData(
        ticker[ticker.length - 1],
        moment().subtract(180, 'days').format('YYYY-MM-DD'),
        moment().subtract(1, 'days').format('YYYY-MM-DD'),
        '4hour'
      );
    }
  };

  const selectedFilter = (filter) => {
    if (dateFilter === filter) {
      return {
        fontWeight: 'bold',
        borderBottom: '2px solid',
        textShadow: '0 0 1px rgba(0, 0, 0, 0.5)',
      };
    } else {
      return { fontWeight: 'normal' };
    }
  };

  const historicalPerformance = () => {
    if (data.length > 0) {
      const returnValue = data[0].open - data[data.length - 1].open;
      const returnPercentage =
        ((data[0].open - data[data.length - 1].open) /
          data[data.length - 1].open) *
        100;
      if (returnValue > 0) {
        return (
          <div style={{ gap: '3px' }}>
            <p className='error-message xss'>-{returnValue.toFixed(2)}</p>
            <p className='error-message xss'>
              ({returnPercentage.toFixed(2)}%)
            </p>
            <FaLongArrowAltDown color='rgba(200, 68, 60, 1)' />
          </div>
        );
      } else {
        return (
          <div style={{ gap: '3px' }}>
            <p className='positive-return'>+{returnValue.toFixed(2)}</p>
            <p className='positive-return xss'>
              ({returnPercentage.toFixed(2)}%)
            </p>
            <FaLongArrowAltUp color='rgba(163, 177, 138, 1)' />
          </div>
        );
      }
    } else {
      return '-';
    }
  };

  return (
    <div>
      <Navbar initialLoad={initialLoad} showSearchBox={true} />
      {initialLoad ? (
        <div className='search-box-dashboard'>
          <PropagateLoader color='#000000' size={10} />
        </div>
      ) : (
        <div className='stock-screen-grid container metrics-container'>
          <div className='card'>Stock</div>
          <div className='card stock-chart-container'>
            <div>
              <li className='btn-outline'>
                <a
                  style={selectedFilter('5d')}
                  onClick={() => changeFilter('5d')}
                >
                  5 D
                </a>
                <a
                  onClick={() => changeFilter('1m')}
                  style={selectedFilter('1m')}
                >
                  1 M
                </a>
                <a
                  onClick={() => changeFilter('6m')}
                  style={selectedFilter('6m')}
                >
                  6 M
                </a>
                {fetchLoad && <SyncLoader color='#000000' size={3} />}
              </li>
              {historicalPerformance()}
            </div>
            {data?.length > 0 ? (
              <StockChart dateFilter={dateFilter} />
            ) : (
              <p>Couldn't fetch the data</p>
            )}
          </div>
          <div className='box card'>Stock Info</div>
          <div className='box card'>Stock transactions</div>
        </div>
      )}
    </div>
  );
};

export default StockScreen;
