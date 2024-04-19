import { useSelector } from 'react-redux';
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
        {pageNumbers.map((number) => (
          <li key={number} className='page-item'>
            <a
              onClick={() => paginate(number)}
              style={{
                fontWeight: number == currentPage ? '600' : '400',
              }}
              className='btn-outline xss'
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
