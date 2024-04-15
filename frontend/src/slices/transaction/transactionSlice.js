import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userTransactions: 0,
};

// Creates slices for the user API methods
const transactionSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.userTransactions = action.payload;
      localStorage.setItem('userTransactions', JSON.stringify(action.payload));
    },
  },
});

export const { setTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;
