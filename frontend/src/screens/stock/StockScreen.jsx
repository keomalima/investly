import Navbar from '../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import moment from 'moment';
import './styles.css';
import StockChart from '../../components/stockChart/StockChart';
import { getStockDataChartAPI } from '../../utils/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStockChartData,
  setStockDateFilter,
} from '../../slices/stock/stockSlice';
import { useLocation } from 'react-router-dom';
import PropagateLoader from 'react-spinners/PropagateLoader';

const StockScreen = () => {
  const dispatch = useDispatch();

  //Get the ticker from the URL
  const { pathname } = useLocation();
  const ticker = pathname.split('/');

  const [initialLoad, setInitialLoad] = useState(true);
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
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      console.log(dateFrom, dateTo);
      const res = await getStockDataChartAPI(
        ticker[ticker.length - 1],
        dateFrom,
        dateTo,
        timeFrame
      );
      if (res) {
        dispatch(setStockChartData(res));
      }
      setInitialLoad(false);
    } catch (error) {
      setInitialLoad(false);
      console.log(error);
    }
  };

  const selectedFilter = (filter) => {
    if (dateFilter === filter) {
      return { fontWeight: 'bold', borderBottom: '0.5px' };
    } else {
      return { fontWeight: 'normal' };
    }
  };

  const changeFilter = (range) => {
    if (range === '5d') {
      setDateFrom(moment().subtract(5, 'days').format('YYYY-MM-DD'));
      setDateTo(moment().subtract(1, 'days').format('YYYY-MM-DD'));
      setTimeFrame('30min');
      setDateFilter('5d');
    } else if (range === '1m') {
      setDateFrom(moment().subtract(30, 'days').format('YYYY-MM-DD'));
      setDateTo(moment().subtract(1, 'days').format('YYYY-MM-DD'));
      setTimeFrame('4hour');
      setDateFilter('1m');
    } else {
      setDateFrom(moment().subtract(180, 'days').format('YYYY-MM-DD'));
      setDateTo(moment().subtract(1, 'days').format('YYYY-MM-DD'));
      setTimeFrame('4hour');
      setDateFilter('6m');
    }
    fetchHistoricalData();
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
          <div className='box card'>Stock</div>
          <div className='box card stock-chart-container'>
            <div>
              <li className='btn-outline'>
                <a
                  onClick={() => changeFilter('5d')}
                  style={selectedFilter('5d')}
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
              </li>
            </div>
            {data?.length > 0 && <StockChart dateFilter={dateFilter} />}
          </div>
          <div className='box card'>Stock Info</div>
          <div className='box card'>Stock transactions</div>
        </div>
      )}
    </div>
  );
};

export default StockScreen;
