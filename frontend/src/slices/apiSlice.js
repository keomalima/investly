import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout } from './auth/authSlice'; // Assuming logout action
import { redirect } from 'react-router-dom';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`, // Adjust the base URL as needed
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token'); // Or sessionStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Logout user whenever the token has expired
const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 403) {
    api.dispatch(logout()); // Directly dispatch logout action
    redirect('/login');
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({}),
});
