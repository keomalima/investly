import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout } from './auth/authSlice'; // Assuming logout action
import { redirect } from 'react-router-dom';

const baseQuery = fetchBaseQuery('');

//Unlogs user whenever the token as expired
const baseQueryWithAuth = async (args, api) => {
  let result = await baseQuery(args, api);
  if (result.error && result.error.status === 403) {
    api.dispatch(logout()); // Directly dispatch logout action
    redirect('/login');
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});
