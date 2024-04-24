import PropagateLoader from 'react-spinners/PropagateLoader';
import Navbar from '../../components/navbar/Navbar';
import './styles.css';
import StockCard from '../../components/stockCard/StockCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import SearchBox from '../../components/searchBox/SearchBox';
import { useGetTransactionsMutation } from '../../slices/transaction/transactionApiSlice';
import { setTransactions } from '../../slices/transaction/transactionSlice';
import TransactionTable from '../../components/transactionTable/TransactionTable';
import Pagination from '../../components/pagination/Pagination';
import { current } from '@reduxjs/toolkit';

const Transactions = () => {
  const dispatch = useDispatch();

  const [initialLoad, setInitialLoad] = useState(true);

  // Set current page
  const [currentPage, setCurrentPage] = useState(1);
  const [metricsPerPage, setMetricsPerPage] = useState(10);

  // Retrieves the states from the redux store
  const { openCard } = useSelector((state) => state.stockData);
  const { userTransactions } = useSelector((state) => state.transactionData);

  // Gets the get transactions and portofolio API methods
  const [getTransactions, { isLoading }] = useGetTransactionsMutation();

  // fetches the transactions and portfolio data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getTransactions().unwrap();
        dispatch(setTransactions({ ...transactions }));
        setInitialLoad(false);
      } catch (error) {
        setInitialLoad(false);
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  // Change page
  const paginate = async ({ pageNumber = 1, size = metricsPerPage }) => {
    setInitialLoad(true);
    try {
      setCurrentPage(pageNumber || 1);
      const transactions = await getTransactions({
        size: size,
        page: pageNumber - 1,
        sortBy: 'ticker',
        sortOrder: 'asc',
      }).unwrap();
      dispatch(setTransactions({ ...transactions }));
      setInitialLoad(false);
    } catch (error) {
      setInitialLoad(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar
        load={initialLoad}
        showSearchBox={userTransactions?.transactions?.rows ? true : false}
      />
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
        ) : userTransactions?.transactions?.rows.length > 0 ? (
          <div>
            <div className='table-pagination-container'>
              <TransactionTable
                userTransactions={userTransactions}
                setMetricsPerPage={setMetricsPerPage}
                metricsPerPage={metricsPerPage}
                setCurrentPage={setCurrentPage}
                isLoading={isLoading}
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

export default Transactions;
