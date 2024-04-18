import { stockApiSlice } from '../apiStockSlice';

const BASE_URL = '/api/v3/profile/';

// Responsible for connecting the frontend and backend
export const stockDataSlice = stockApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.mutation({
      query: (symbol) => ({
        url: `${BASE_URL}${symbol}`,
        method: 'GET',
        params: {
          apikey: import.meta.env.VITE_FINANCIAL_API_KEY,
        },
      }),
    }),
  }),
});

export const { useGetStockDataMutation } = stockDataSlice;
