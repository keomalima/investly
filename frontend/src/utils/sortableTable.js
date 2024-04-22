import { useDispatch, useSelector } from 'react-redux';
import { setPortfolioMetrics } from '../slices/portfolio/portfolioSlice';

export function sortTable(sortField, sortOrder) {
  const dispatch = useDispatch();
  const { portfolioMetrics } = useSelector((state) => state.portfolioMetrics);

  if (sortField) {
    const sorted = [...portfolioMetrics.getPortfolioMetrics].sort((a, b) => {
      return (
        a[sortField].toString().localeCompare(b[sortField].toString(), 'en', {
          numeric: true,
        }) * (sortOrder === 'asc' ? 1 : -1)
      );
    });
    dispatch(setPortfolioMetrics({ ...sorted }));
  }
}
