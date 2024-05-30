import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import transactionReducer from './slices/transaction/transactionSlice';
import { apiSlice } from './slices/apiSlice';
import stockReducer from './slices/stock/stockSlice';
import portfolioSlice from './slices/portfolio/portfolioSlice';
import themeReducer from './slices/themeSlice';
// Create redux store and sets its reducers
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    transactionData: transactionReducer,
    theme: themeReducer,
    stockData: stockReducer,
    portfolioMetrics: portfolioSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
