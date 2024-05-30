// src/components/ThemeToggle.jsx
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../slices/themeSlice.js';

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button className='btn' onClick={handleToggle}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
};

export default ThemeToggle;
