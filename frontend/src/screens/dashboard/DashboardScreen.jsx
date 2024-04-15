import MetricCard from '../../components/metricCard/MetricCard';
import Navbar from '../../components/navbar/Navbar';
import StockForm from '../../components/stockForm/StockForm';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTransactionsMutation } from '../../slices/transaction/transactionApiSlice';
import { setTransactions } from '../../slices/transaction/transactionSlice';

import './styles.css';

const DashboardScreen = () => {
  const dispatch = useDispatch();

  const [getTransactions, { isLoading }] = useGetTransactionsMutation();

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
        <div className='flex-center'>
          <StockForm />
        </div>
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
