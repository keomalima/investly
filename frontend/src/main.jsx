import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import App from './App.jsx';
import LoginScreen from './screens/login/LoginScreen.jsx';
import RegisterScreen from './screens/register/RegisterScreen.jsx';
import DashboardScreen from './screens/dashboard/DashboardScreen.jsx';
import PrivateRoute from './components/privateRoute.jsx';
import ErrorPage from './screens/error-page.jsx';
import Transactions from './screens/transactions/Transactions.jsx';
import StockScreen from './screens/stock/StockScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    // Creates the routh tree and route protection
    <Route path='/' element={<App />} errorElement={<ErrorPage />}>
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/' element={<DashboardScreen />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/stock/:stockTicker' element={<StockScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
