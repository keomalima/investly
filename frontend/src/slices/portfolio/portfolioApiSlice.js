import { apiSlice } from '../apiSlice';
//const USERS_URL = '/api/portfolio';
const USERS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/portfolio`;

// Responsible for making the API call for the database
export const portfolioApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioMetrics: builder.mutation({
      query: () => ({
        url: `${USERS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useGetPortfolioMetricsMutation } = portfolioApiSlice;
