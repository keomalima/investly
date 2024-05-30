// src/components/ThemeToggle.jsx
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleTheme } from '../../slices/themeSlice.js';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import './styles.css';
import { useEffect } from 'react';

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    // Retrieve theme preference from local storage on component mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme)); // Dispatch the saved theme
    }
  }, [dispatch]);

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(toggleTheme(newTheme));

    // Save the theme preference to local storage
    localStorage.setItem('theme', newTheme);
  };

  // Controls the theme for the app
  return (
    <div className='switch'>
      <DarkModeSwitch
        checked={theme === 'dark'}
        onChange={handleToggle}
        size={20}
        moonColor='white'
        sunColor='orange'
      />
    </div>
  );
};

export default ThemeToggle;
