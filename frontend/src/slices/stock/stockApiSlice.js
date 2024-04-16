import { stockApiSlice } from '../apiStockSlice';

const BASE_URL = '/api/v1';

// Responsible for making the API call for the stocks
export const stockDataSlice = stockApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockData: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/stock`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetStockDataMutation } = stockDataSlice;
