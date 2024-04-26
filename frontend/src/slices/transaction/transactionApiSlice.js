import { apiSlice } from '../apiSlice';
const USERS_URL = '/api/transactions';

// Responsible for making the API call for the database
export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}`,
        method: 'GET',
        params,
      }),
    }),
    addTransaction: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateTransaction: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteTransaction: builder.mutation({
      query: ({ id }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTransactionsMutation,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApiSlice;
