import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockData: 0,
  openCard: false,
};

// Creates slices and actions for the user API methods
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStock: (state, action) => {
      state.stockData = action.payload;
      state.openCard = true;
    },
    resetStock: (state) => {
      state.openCard = false;
    },
  },
});

export const { setStock, resetStock } = stockSlice.actions;

export default stockSlice.reducer;
