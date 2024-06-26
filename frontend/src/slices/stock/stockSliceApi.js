import { apiSlice } from '../apiSlice';
//const USERS_URL = '/api/transactions';
const USERS_URL = 'https://financialmodelingprep.com/api';

// Responsible for making the API call for the database
export const stocksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.mutation({
      query: ({ ticker }) => ({
        url: `${USERS_URL}/v3/profile/${ticker}`,
        method: 'GET',
        params: { apikey: import.meta.env.VITE_FINANCIAL_API_KEY },
      }),
    }),
    getStockHistory: builder.mutation({
      query: ({ symbol, from, to, interval }) => ({
        url: `${USERS_URL}/v3/historical-chart/${interval}/${symbol}`,
        method: 'GET',
        params: { apikey: import.meta.env.VITE_FINANCIAL_API_KEY, from, to },
      }),
    }),
  }),
});

export const { useGetStockDataMutation, useGetStockHistoryMutation } =
  stocksApiSlice;
