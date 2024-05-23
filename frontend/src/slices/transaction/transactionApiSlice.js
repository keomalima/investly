import { apiSlice } from '../apiSlice';
//const USERS_URL = '/api/transactions';
const USERS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/transactions`;

// Responsible for making the API call for the database
export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}`,
        method: 'GET',
        params,
        credentials: 'include',
      }),
    }),
    addTransaction: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
    updateTransaction: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
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

export const {
  useGetTransactionsMutation,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApiSlice;
