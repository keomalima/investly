import { useSelector } from 'react-redux';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';

import './styles.css';
import { useMemo } from 'react';

const Pagination = ({
  metricsPerPage,
  paginate,
  currentPage,
  setMetricsPerPage,
  setCurrentPage,
}) => {
  // Selects the portfolio metrics from redux state
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  const pageNumbers = useMemo(() => {
    const totalMetrics = portfolioMetrics.getPortfolioMetrics.length;
    return Array.from(
      { length: Math.ceil(totalMetrics / metricsPerPage) },
      (_, index) => index + 1
    );
  }, [portfolioMetrics, metricsPerPage]);

  const pagesToDisplay = 5; // Number of pages to display

  // Calculate the start and end indices
  let startPage = Math.max(currentPage - Math.floor(pagesToDisplay / 2), 1);
  let endPage = Math.min(startPage + pagesToDisplay - 1, pageNumbers.length);

  // Adjust the range if necessary to ensure that 5 pages are displayed
  if (endPage - startPage + 1 < pagesToDisplay) {
    startPage = Math.max(endPage - pagesToDisplay + 1, 1);
  }

  // Get the page numbers to display
  const displayedPages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const changePerPage = (number) => {
    setMetricsPerPage(number);
    setCurrentPage(1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Scrolls the view to the top when the user changes the table page
  const changePage = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className='grid pagination-grid'>
      <nav>
        <ul className='pagination-button'>
          <a
            className={currentPage === 1 ? 'disabled' : ''}
            onClick={() => {
              paginate(currentPage - 1);
              changePage();
            }}
          >
            <IoIosArrowBack />
          </a>
          {displayedPages.map((number) => (
            <li
              key={number}
              onClick={() => {
                paginate(number);
                changePage();
              }}
              style={{
                backgroundColor: number == currentPage ? 'black' : 'white',
                borderRadius: '5px',
                color: number == currentPage ? 'white' : 'black',
              }}
            >
              <a
                style={{
                  fontWeight: number == currentPage ? '700' : '500',
                }}
                className='xss'
              >
                {number}
              </a>
            </li>
          ))}
          <a
            className={
              currentPage === pageNumbers[pageNumbers.length - 1]
                ? 'disabled'
                : ''
            }
            onClick={() => {
              paginate(currentPage + 1);
              changePage();
            }}
          >
            <IoIosArrowForward />
          </a>
        </ul>
      </nav>
      <nav className='pageper-container'>
        <ul className='pagination-button'>
          <li
            style={{
              backgroundColor: metricsPerPage == 5 ? 'black' : 'white',
              borderRadius: '5px',
              color: metricsPerPage == 5 ? 'white' : 'black',
            }}
            onClick={() => changePerPage(5)}
          >
            <a
              style={{
                fontWeight: metricsPerPage == 5 ? '700' : '500',
              }}
              className='xss'
            >
              5
            </a>
          </li>
          <li
            style={{
              backgroundColor: metricsPerPage == 10 ? 'black' : 'white',
              borderRadius: '5px',
              color: metricsPerPage == 10 ? 'white' : 'black',
            }}
            onClick={() => changePerPage(10)}
          >
            <a
              style={{
                fontWeight: metricsPerPage == 10 ? '700' : '500',
              }}
              className='xss'
            >
              10
            </a>
          </li>
          <li
            style={{
              backgroundColor: metricsPerPage == 15 ? 'black' : 'white',
              borderRadius: '5px',
              color: metricsPerPage == 15 ? 'white' : 'black',
            }}
            onClick={() => changePerPage(15)}
          >
            <a
              style={{
                fontWeight: metricsPerPage == 15 ? '700' : '500',
              }}
              className='xss'
            >
              15
            </a>
          </li>
        </ul>
        <p className='xss'>per page</p>
      </nav>
    </div>
  );
};

export default Pagination;
