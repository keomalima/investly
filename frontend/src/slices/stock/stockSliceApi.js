import { apiSlice } from '../apiSlice';
//const USERS_URL = '/api/transactions';
const USERS_URL = '/fmp-api';

// Responsible for making the API call for the database
export const stocksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.mutation({
      query: ({ ticker }) => ({
        url: `${USERS_URL}/v3/profile/${ticker}`,
        method: 'GET',
        params: { apikey: import.meta.env.VITE_FINANCIAL_API_KEY },
        credentials: 'include',
      }),
    }),
    deleteTransaction: builder.mutation({
      query: ({ id }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useGetStockDataMutation } = stocksApiSlice;
