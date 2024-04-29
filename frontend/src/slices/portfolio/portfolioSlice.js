import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  portfolioMetrics: null,
};

// Creates slices for the user API methods
const portfolioSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setPortfolioMetrics: (state, action) => {
      state.portfolioMetrics = action.payload;
    },
    resetPortfolio: (state) => {
      return {
        ...state,
        portfolioMetrics: null,
      };
    },
  },
});

export const { setPortfolioMetrics, resetPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;
