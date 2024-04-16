import { apiSlice } from '../apiSlice';
const USERS_URL = '/api/transactions';

// Responsible for making the API call for the database
export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.mutation({
      query: () => ({
        url: `${USERS_URL}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetTransactionsMutation } = transactionsApiSlice;
