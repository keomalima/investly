import Navbar from '../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import moment from 'moment';
import './styles.css';
import StockChart from '../../components/stockChart/StockChart';
import { getStockDataAPI, getStockDataChartAPI } from '../../utils/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { setStockChartData, setStockInfo } from '../../slices/stock/stockSlice';
import { useLocation } from 'react-router-dom';
import PropagateLoader from 'react-spinners/PropagateLoader';
import SyncLoader from 'react-spinners/SyncLoader';
import { FaLongArrowAltUp } from 'react-icons/fa';
import { FaLongArrowAltDown } from 'react-icons/fa';
import StockCard from '../../components/stockCard/StockCard';
import TransactionTable from '../../components/transactionTable/TransactionTable';
import Pagination from '../../components/pagination/Pagination';
import { useGetTransactionsMutation } from '../../slices/transaction/transactionApiSlice';
import { setTransactions } from '../../slices/transaction/transactionSlice';
import StockPrice from '../../components/stockPrice/StockPrice';

const StockScreen = () => {
  const dispatch = useDispatch();

  //Get the ticker from the URL
  const { pathname } = useLocation();
  const ticker = pathname.split('/');

  // Set current page
  const [currentPage, setCurrentPage] = useState(1);
  const [metricsPerPage, setMetricsPerPage] = useState(5);
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

  const [getTransactions, { isLoading }] = useGetTransactionsMutation();

  const { openCard } = useSelector((state) => state.stockData);
  const { userTransactions } = useSelector((state) => state.transactionData);
  const { stockChartData: data } = useSelector((state) => state.stockData);

  useEffect(() => {
    fetchHistoricalData(ticker[ticker.length - 1], dateFrom, dateTo, timeFrame);
    fetchTransactions();
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const res = await getStockDataAPI(ticker[2]);
      dispatch(setStockInfo(res));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactions = await getTransactions({
        size: 5,
        searchQuery: ticker[2],
      }).unwrap();
      dispatch(setTransactions({ ...transactions }));
    } catch (error) {
      console.log(error);
    }
  };

  // Change page
  const paginate = async ({
    pageNumber = 1,
    size = metricsPerPage,
    sortBy = userTransactions?.sortBy,
    sortOrder = userTransactions?.sortOrder,
    searchQuery = userTransactions?.searchQuery,
  }) => {
    setInitialLoad(true);
    try {
      setCurrentPage(pageNumber || 1);
      const transactions = await getTransactions({
        size: size,
        page: pageNumber - 1,
        sortBy,
        sortOrder,
        searchQuery,
      }).unwrap();
      dispatch(setTransactions({ ...transactions }));
    } catch (error) {
      setInitialLoad(false);
      console.log(error);
    } finally {
      setTimeout(() => {
        setInitialLoad(false); // Set loading state to false after a short delay
      }, 120);
    }
  };

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

  const searchStock = async (e) => {
    e.preventDefault();
    try {
      paginate({ searchQuery: searchQuery.toUpperCase() });
    } catch (error) {
      console.log(error);
    }
  };

  const historicalPerformance = () => {
    if (data?.length > 0) {
      const returnValue = data[0].open - data[data.length - 1].open;
      const returnPercentage =
        ((data[0].open - data[data.length - 1].open) /
          data[data.length - 1].open) *
        100;
      if (returnValue < 0) {
        return (
          <div style={{ gap: '3px' }}>
            <p className='error-message xss'>{returnValue.toFixed(2)}</p>
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
        <div>
          {openCard && (
            <div className='flex-center'>
              <StockCard />
            </div>
          )}
          <div className='stock-screen-grid container metrics-container'>
            <div className='card'>
              <StockPrice />
            </div>
            <div className='card stock-chart-outter-container'>
              <div className='stock-chart-container'>
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
                  <p>Couldn&apos;t fetch the data</p>
                )}
              </div>
              <div className='chart-info-flex'>
                <div className=''>
                  <p className='xss'>Open</p>
                  {data ? (
                    <p className='semi-bold xss'>
                      {data[data.length - 1].open}
                    </p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className='xss'>High</p>
                  {data ? (
                    <p className='semi-bold xss'>
                      {Math.max(...data.map((item) => item.high))}
                    </p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className='xss'>Low</p>
                  {data ? (
                    <p className='semi-bold xss'>
                      {Math.min(...data.map((item) => item.high))}
                    </p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className='xss'>Close</p>
                  {data ? (
                    <p className='semi-bold xss'>{data[0].close}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            </div>
            <div className='box card'>Stock Info</div>
            <div className=''>
              <div className='table-pagination-container'>
                <TransactionTable
                  userTransactions={userTransactions}
                  setMetricsPerPage={setMetricsPerPage}
                  metricsPerPage={metricsPerPage}
                  setCurrentPage={setCurrentPage}
                  isLoading={isLoading}
                  searchBox={ticker}
                  paginate={paginate}
                />
                <Pagination
                  currentPage={currentPage}
                  metricsPerPage={metricsPerPage}
                  totalMetrics={userTransactions?.transactions?.count}
                  paginate={paginate}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockScreen;
