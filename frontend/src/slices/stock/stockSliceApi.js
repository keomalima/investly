import { apiSlice } from '../apiSlice';
//const USERS_URL = '/api/transactions';
const USERS_URL = `${
  import.meta.env.VITE_API_STOCK_BASE_URL
}/fmp-api/v3/profile`;

// Responsible for making the API call for the database
export const stocksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.mutation({
      query: ({ ticker }) => ({
        url: `${USERS_URL}/${ticker}`,
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
