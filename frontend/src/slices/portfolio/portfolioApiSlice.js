import { apiSlice } from '../apiSlice';
const USERS_URL = '/api/portfolio';

// Responsible for making the API call for the database
export const portfolioApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioMetrics: builder.mutation({
      query: () => ({
        url: `${USERS_URL}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetPortfolioMetricsMutation } = portfolioApiSlice;
