import { useSelector } from 'react-redux';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';

import './styles.css';

const Pagination = ({ metricsPerPage, paginate, currentPage }) => {
  // Selects the portfolio metrics from redux state
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  const pageNumbers = [];

  for (
    let i = 1;
    i <=
    Math.ceil(portfolioMetrics.getPortfolioMetrics.length / metricsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination-button'>
        <a onClick={() => paginate(currentPage - 1)}>
          <IoIosArrowBack />
        </a>
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
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
        <a onClick={() => paginate(currentPage + 1)}>
          <IoIosArrowForward />
        </a>
      </ul>
    </nav>
  );
};

export default Pagination;
