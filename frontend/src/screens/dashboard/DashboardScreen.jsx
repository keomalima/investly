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

const DashboardScreen = () => {
  const dispatch = useDispatch();

  // Sets the state for the metrics dashboard
  const [metrics, setMetrics] = useState('');

  // Retrieves the states from the redux store
  const { openCard } = useSelector((state) => state.stockData);
  const { userTransactions } = useSelector((state) => state.transactionData);
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  // Gets the API methods
  const [getTransactions, { isSuccess, error }] = useGetTransactionsMutation();
  const [getPortolioMetrics, { isLoading }] = useGetPortfolioMetricsMutation();

  // fetches the transactions and portfolio data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions().unwrap();
        const portfolio = await getPortolioMetrics().unwrap();
        dispatch(setPortfolioMetrics({ ...portfolio }));
        dispatch(setTransactions({ ...res }));
      } catch (error) {
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
      <Navbar />
      <div className='metrics-container container'>
        {openCard && (
          <div className='flex-center'>
            <StockCard />
          </div>
        )}
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
      </div>
    </div>
  );
};

export default DashboardScreen;
