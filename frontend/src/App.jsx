import { Outlet } from 'react-router-dom';
import './App.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
