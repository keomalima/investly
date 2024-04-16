import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  portFolioMetrics: null,
};

// Creates slices for the user API methods
const portfolioSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setPortfolioMetrics: (state, action) => {
      state.portFolioMetrics = action.payload;
    },
  },
});

export const { setPortfolioMetrics } = portfolioSlice.actions;

export default portfolioSlice.reducer;
