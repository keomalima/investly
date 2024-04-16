import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import transactionReducer from './slices/transaction/transactionSlice';
import { apiSlice } from './slices/apiSlice';
import stockReducer from './slices/stock/stockSlice';
import { stockApiSlice } from './slices/apiStockSlice';
import portfolioSlice from './slices/portfolio/portfolioSlice';

// Create redux store and sets its reducers
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [stockApiSlice.reducerPath]: stockApiSlice.reducer,
    auth: authReducer,
    transactionData: transactionReducer,
    stockData: stockReducer,
    portfolioMetrics: portfolioSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      stockApiSlice.middleware
    ),
  devTools: true,
});

export default store;
