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
          apikey: 'i5fhTi4Ybn4kkkskdHNQ5JQbb5fXy6iC',
        },
      }),
      keepUnusedDataFor: 5, // Set keepUnusedDataFor option for the endpoint
    }),
  }),
});

export const { useGetStockDataMutation } = stockDataSlice;
