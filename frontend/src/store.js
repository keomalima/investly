import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import transactionReducer from './slices/transaction/transactionSlice';
import { apiSlice } from './slices/apiSlice';

// Create redux store and sets its reducers
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    data: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
