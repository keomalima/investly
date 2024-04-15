import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockData: 0,
};

// Creates slices for the user API methods
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStock: (state, action) => {
      state.stockData = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
  },
});

export const { setStock } = stockSlice.actions;

export default stockSlice.reducer;
