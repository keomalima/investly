import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockData: null,
  openCard: false,
  editStock: false,
};

// Creates slices and actions for the user API methods
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStock: (state, action) => {
      state.stockData = action.payload;
      state.openCard = true;
      state.editStock = false;
    },
    editStock: (state, action) => {
      state.stockData = action.payload;
      state.openCard = true;
      state.editStock = true;
    },
    resetStock: (state) => {
      state.openCard = false;
      state.editStock = false;
    },
  },
});

export const { setStock, resetStock, editStock } = stockSlice.actions;

export default stockSlice.reducer;
