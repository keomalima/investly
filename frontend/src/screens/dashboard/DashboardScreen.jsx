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

const DashboardScreen = () => {
  const dispatch = useDispatch();

  const [metricsData, setMetricsData] = useState([]);
  const [getTransactions, { isLoading, error }] = useGetTransactionsMutation();
  const [getPortolioMetrics] = useGetPortfolioMetricsMutation();
  const { openCard } = useSelector((state) => state.stockData);

  // fetches the transactions and portfolio data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions().unwrap();
        const portfolio = await getPortolioMetrics().unwrap();
        setMetricsData(portfolio);
        dispatch(setPortfolioMetrics({ ...portfolio }));
        dispatch(setTransactions({ ...res }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

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
          <MetricCard title={'Total Profit'} />
          <MetricCard title={'Portfolio Value'} />
          <MetricCard title={'Total Invested'} />
          <MetricCard title={'Return'} />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
