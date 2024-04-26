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
      return {
        ...state,
        userTransactions: action.payload,
      };
    },
    deleteTransaction: (state, action) => {
      return {
        ...state,
        userTransactions: {
          ...state.userTransactions,
          transactions: {
            count: state.userTransactions.transactions.count - 1,
            rows: state.userTransactions.transactions.rows.filter(
              (transaction) => transaction.id !== action.payload
            ),
          },
        },
      };
    },
  },
});

export const { setTransactions, deleteTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
