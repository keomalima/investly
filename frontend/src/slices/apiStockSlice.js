import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://financialmodelingprep.com',
});

export const stockApiSlice = createApi({
  reducerPath: 'stockApi',
  baseQuery,
  tagTypes: ['Stock'],
  endpoints: (builder) => ({}),
});
