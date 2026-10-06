import { apiSlice } from '../apiSlice';
//const USERS_URL = '/api/transactions';
const USERS_URL = '/api/stocks';

// Responsible for making the API call for the database
export const stocksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.mutation({
      query: ({ ticker }) => ({
        url: `${USERS_URL}/profile`,
        method: 'GET',
        params: { symbol: ticker },
      }),
    }),
    getStockHistory: builder.mutation({
      query: ({ symbol, from, to, interval }) => ({
        url: `${USERS_URL}/history`,
        method: 'GET',
        params: { symbol, from, to, interval },
      }),
    }),
  }),
});

export const { useGetStockDataMutation, useGetStockHistoryMutation } =
  stocksApiSlice;
