import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userTransactions: null,
};

// Creates slices for the user API methods
const transactionSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.userTransactions = action.payload;
    },
  },
});

export const { setTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;
