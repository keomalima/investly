import { apiSlice } from '../apiSlice';
//const USERS_URL = '/api/users';
const USERS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`;

// Responsible for making the API calls
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
        credentials: 'include',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  userApiSlice;
