import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../slices/auth/usersApiSlice';
import { logout } from '../../slices/auth/authSlice';
import SearchBox from '../searchBox/SearchBox';
import { resetStock } from '../../slices/stock/stockSlice';
import { resetPortfolio } from '../../slices/portfolio/portfolioSlice';
import { resetTransactios } from '../../slices/transaction/transactionSlice';
import ThemeToggle from '../themeToggle/ThemeToggle';

const Navbar = ({ load, showSearchBox }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Gets user and transaction data from redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Gets the URL's path name
  const { pathname } = useLocation();

  // Instantiates the logout API method
  const [logoutApiCall] = useLogoutMutation();

  // Resets the original state of the card
  const closeCard = () => {
    dispatch(resetStock());
  };

  // Capitalizes the first letters of the username
  const capitalizeFirstLetters = (str) => {
    if (str) {
      const capitalizedStr = str.replace(/(^\w{1})|(\s\w{1})/g, (match) =>
        match.toUpperCase()
      );
      return capitalizedStr;
    } else {
      return '';
    }
  };

  // Dinamically changes the font weight of selected menu option
  const menuStyle = (path) => {
    if (pathname === path) {
      return { fontWeight: 'bold' };
    } else {
      return { fontWeight: 'normal' };
    }
  };

  // Handles the logout form
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetPortfolio());
      dispatch(resetTransactios());
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className='navbar'>
      <div className='container flex'>
        <div className='flex'>
          <svg
            className='nav_icon'
            xmlns='http://www.w3.org/2000/svg'
            width='40px'
            height='40px'
            viewBox='0 0 24 24'
            id='box'
          >
            <path
              fill='var(--text-color)'
              d='M20.47,7.37s0,0,0-.08l-.06-.15a.71.71,0,0,0-.07-.09.94.94,0,0,0-.09-.12l-.09-.07L20,6.78l-7.5-4.63a1,1,0,0,0-1.06,0L4,6.78l-.09.08-.09.07a.94.94,0,0,0-.09.12.71.71,0,0,0-.07.09l-.06.15s0,0,0,.08a1.15,1.15,0,0,0,0,.26v8.74a1,1,0,0,0,.47.85l7.5,4.63h0a.47.47,0,0,0,.15.06s.05,0,.08,0a.86.86,0,0,0,.52,0s.05,0,.08,0a.47.47,0,0,0,.15-.06h0L20,17.22a1,1,0,0,0,.47-.85V7.63A1.15,1.15,0,0,0,20.47,7.37ZM11,19.21l-5.5-3.4V9.43L11,12.82Zm1-8.12L6.4,7.63,12,4.18l5.6,3.45Zm6.5,4.72L13,19.21V12.82l5.5-3.39Z'
            ></path>
          </svg>
          <ul className='flex'>
            <li>
              <a
                style={menuStyle('/')}
                className='btn-outline xss'
                onClick={() => {
                  navigate('/');
                  closeCard();
                }}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                style={menuStyle('/transactions')}
                onClick={() => {
                  navigate('/transactions');
                  closeCard();
                }}
                className='btn-outline xss'
              >
                Transactions
              </a>
            </li>
          </ul>
        </div>
        {load ? <></> : showSearchBox && <SearchBox />}
        <div className='flex'>
          <ThemeToggle />
          <p className='xss'>
            {capitalizeFirstLetters(userInfo?.username) ||
              capitalizeFirstLetters(userInfo?.name)}
          </p>

          <a className='btn-outline xss' onClick={logoutHandler}>
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
