import MetricCard from '../../components/metricCard/MetricCard';
import Navbar from '../../components/navbar/Navbar';
import StockForm from '../../components/stockForm/StockForm';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTransactionsMutation } from '../../slices/transaction/transactionApiSlice';
import { setTransactions } from '../../slices/transaction/transactionSlice';

import './styles.css';
import StockCard from '../../components/stockCard/StockCard';

const DashboardScreen = () => {
  const dispatch = useDispatch();

  const [getTransactions, { isLoading }] = useGetTransactionsMutation();
  const { openCard } = useSelector((state) => state.stockData);

  // fetches the transactions and portfolio data
  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await getTransactions().unwrap();
      dispatch(setTransactions({ ...res }));
    };

    fetchTransactions();
  }, [dispatch, getTransactions]);

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
          <MetricCard />
          <MetricCard />
          <MetricCard />
          <MetricCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
