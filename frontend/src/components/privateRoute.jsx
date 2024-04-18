import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Checks if there's user information saved to create a protected route
const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
