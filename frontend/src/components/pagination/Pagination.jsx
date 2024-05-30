import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';

import './styles.css';
import { useMemo } from 'react';

const Pagination = ({
  metricsPerPage,
  paginate,
  currentPage,
  totalMetrics,
}) => {
  const pageNumbers = useMemo(() => {
    return Array.from(
      { length: Math.ceil(totalMetrics / metricsPerPage) },
      (_, index) => index + 1
    );
  }, [metricsPerPage, totalMetrics]);

  // Number of pages numbers to display
  const pagesToDisplay = 5;

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

  // Scrolls the view to the top when the user changes the table page
  const changePage = (number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    paginate({ pageNumber: number });
  };

  return (
    <nav>
      <ul className='pagination-button'>
        <a
          className={
            currentPage === 1 || pageNumbers.length == 0 ? 'disabled' : ''
          }
          onClick={() => {
            changePage(currentPage - 1);
          }}
        >
          <IoIosArrowBack />
        </a>
        {displayedPages.map((number) => (
          <li
            key={number}
            onClick={() => {
              changePage(number);
            }}
            style={{
              backgroundColor:
                number == currentPage
                  ? 'var(--text-color)'
                  : 'var(--card-color2)',
              borderRadius: '5px',
              color:
                number == currentPage
                  ? 'var(--card-color2)'
                  : 'var(--text-color)',
            }}
            className={currentPage === number ? 'disabled' : ''}
          >
            <a
              style={{
                fontWeight: number == currentPage ? '700' : '500',
              }}
              className={'xss'}
            >
              {number}
            </a>
          </li>
        ))}
        <a
          className={
            currentPage === pageNumbers[pageNumbers.length - 1] ||
            pageNumbers.length == 0
              ? 'disabled'
              : ''
          }
          onClick={() => {
            changePage(currentPage + 1);
          }}
        >
          <IoIosArrowForward />
        </a>
      </ul>
    </nav>
  );
};

export default Pagination;
