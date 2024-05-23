import MetricCard from '../../components/metricCard/MetricCard';
import Navbar from '../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import StockCard from '../../components/stockCard/StockCard';
import { useGetPortfolioMetricsMutation } from '../../slices/portfolio/portfolioApiSlice';
import { setPortfolioMetrics } from '../../slices/portfolio/portfolioSlice';
import { calculatePortfolioMetrics } from '../../utils/metricsCalculations';
import SearchBox from '../../components/searchBox/SearchBox';
import PropagateLoader from 'react-spinners/PropagateLoader';
import MetricTable from '../../components/metricTable/MetricTable';
import Pagination from '../../components/pagination/Pagination';

const DashboardScreen = () => {
  const dispatch = useDispatch();

  // Sets the state for the metrics dashboard and initial load
  const [metrics, setMetrics] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [metricsPerPage, setMetricsPerPage] = useState(10);

  // Retrieves the states from the redux store
  const { openCard } = useSelector((state) => state.stockData);
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  // Sets the total metrics to be used in the pagination component
  const [totalMetrics, setTotalMetrics] = useState('');

  // Gets the get transactions and portofolio API methods
  const [getPortolioMetrics, { isLoading }] = useGetPortfolioMetricsMutation();

  // fetches the transactions and portfolio data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const portfolio = await getPortolioMetrics().unwrap();
        if (portfolio) {
          dispatch(setPortfolioMetrics({ ...portfolio }));
          setTotalMetrics(portfolio.getPortfolioMetrics.length);
        }
        setInitialLoad(false);
      } catch (error) {
        console.log(error);
        setInitialLoad(false);
      }
    };

    fetchMetrics();
  }, []);

  // Get current metrics for pagination
  const indexOfLastMetric = currentPage * metricsPerPage;
  const indexOfFirstMetric = indexOfLastMetric - metricsPerPage;

  // Change page
  const paginate = ({ pageNumber }) => setCurrentPage(pageNumber);

  //Calls the methods to calculates the metrics for the main dashboard
  useEffect(() => {
    if (portfolioMetrics) {
      setMetrics(calculatePortfolioMetrics(portfolioMetrics));
    }
  }, [portfolioMetrics]);

  return (
    <div>
      <Navbar
        load={initialLoad}
        showSearchBox={
          portfolioMetrics?.getPortfolioMetrics.length > 0 ? true : false
        }
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
        ) : portfolioMetrics?.getPortfolioMetrics?.length > 0 ? (
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
            <div className='table-pagination-container'>
              <MetricTable
                isLoading={isLoading}
                indexOfFirstMetric={indexOfFirstMetric}
                indexOfLastMetric={indexOfLastMetric}
                portfolioMetrics={portfolioMetrics}
                setCurrentPage={setCurrentPage}
                setMetricsPerPage={setMetricsPerPage}
                metricsPerPage={metricsPerPage}
                setTotalMetrics={setTotalMetrics}
              />
              <Pagination
                currentPage={currentPage}
                metricsPerPage={metricsPerPage}
                paginate={paginate}
                totalMetrics={totalMetrics}
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

export default DashboardScreen;
