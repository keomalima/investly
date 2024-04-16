import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

// Sets up the config for the API call
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://5faa93b0b5c645001602ac7d.mockapi.io/',
});

export const stockApiSlice = createApi({
  reducerPath: 'stockApi',
  baseQuery,
  tagTypes: ['Stock'],
  endpoints: (builder) => ({}),
});
