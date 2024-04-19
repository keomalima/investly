import MetricCard from '../../components/metricCard/MetricCard';
import Navbar from '../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTransactionsMutation } from '../../slices/transaction/transactionApiSlice';
import { setTransactions } from '../../slices/transaction/transactionSlice';
import './styles.css';
import StockCard from '../../components/stockCard/StockCard';
import { useGetPortfolioMetricsMutation } from '../../slices/portfolio/portfolioApiSlice';
import { setPortfolioMetrics } from '../../slices/portfolio/portfolioSlice';
import { calculatePortfolioMetrics } from '../../utils/metricsCalculations';
import SearchBox from '../../components/searchBox/SearchBox';
import PropagateLoader from 'react-spinners/PropagateLoader';
import MetricTable from '../../components/metricTable/MetricTable';

const DashboardScreen = () => {
  const dispatch = useDispatch();

  // Sets the state for the metrics dashboard and initial load
  const [metrics, setMetrics] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Retrieves the states from the redux store
  const { openCard } = useSelector((state) => state.stockData);
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);
  const { userTransactions } = useSelector((state) => state.transactionData);

  // Gets the get transactions and portofolio API methods
  const [getTransactions] = useGetTransactionsMutation();
  const [getPortolioMetrics, { isLoading }] = useGetPortfolioMetricsMutation();

  // fetches the transactions and portfolio data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions().unwrap();
        const portfolio = await getPortolioMetrics().unwrap();
        dispatch(setPortfolioMetrics({ ...portfolio }));
        dispatch(setTransactions({ ...res }));
        setInitialLoad(false);
      } catch (error) {
        setInitialLoad(false);
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  //Calls the methods to calculates the metrics for the main dashboard
  useEffect(() => {
    if (portfolioMetrics) {
      setMetrics(calculatePortfolioMetrics(portfolioMetrics));
    }
  }, [portfolioMetrics]);

  return (
    <div>
      <Navbar load={initialLoad} />
      <div className='metrics-container container'>
        {openCard && (
          <div className='flex-center'>
            <StockCard />
          </div>
        )}
        {initialLoad ? (
          <div className='search-box-dashboard'>
            <PropagateLoader color='#000000' size={10} />
          </div>
        ) : portfolioMetrics.getPortfolioMetrics.length > 0 ? (
          <div>
            <div className='grid-4'>
              <MetricCard
                title={'Total Profit'}
                value={metrics.profit}
                isLoading={isLoading}
              />
              <MetricCard
                title={'Portfolio Value'}
                value={metrics.totalPortfolio}
                isLoading={isLoading}
              />
              <MetricCard
                title={'Total Invested'}
                isLoading={isLoading}
                value={metrics.totalInvested}
              />
              <MetricCard
                title={'Return'}
                isLoading={isLoading}
                value={metrics.portfolioReturn}
              />
            </div>
            <div>
              <MetricTable />
            </div>
          </div>
        ) : (
          !openCard && (
            <div className='search-box-dashboard'>
              <p>Nothing here. Quote a stock to start!</p>
              <SearchBox isLoading={isLoading} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
