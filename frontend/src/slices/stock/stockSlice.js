import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockData: null,
  openCard: false,
  editStock: false,
  stockChartData: null,
  stockInfo: null,
  stockChartDateFilter: '5d',
};

// Creates slices and actions for the user API methods
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStock: (state, action) => {
      return {
        ...state,
        stockData: action.payload,
        openCard: true,
        editStock: false,
      };
    },
    openStockForm: (state, action) => {
      return {
        ...state,
        stockData: action.payload,
        openCard: true,
        editStock: false,
      };
    },
    setStockInfo: (state, action) => {
      return {
        ...state,
        stockInfo: action.payload,
        openCard: false,
        editStock: false,
      };
    },
    editStock: (state, action) => {
      return {
        ...state,
        stockData: action.payload,
        openCard: true,
        editStock: true,
      };
    },
    resetStock: (state) => {
      state.openCard = false;
      state.editStock = false;
    },
    setStockChartData: (state, action) => {
      return {
        ...state,
        stockChartData: action.payload,
      };
    },
    setStockDateFilter: (state, action) => {
      return {
        ...state,
        stockChartDateFilter: action.payload,
      };
    },
  },
});

export const {
  setStock,
  resetStock,
  editStock,
  setStockChartData,
  setStockDateFilter,
  setStockInfo,
  openStockForm,
} = stockSlice.actions;

export default stockSlice.reducer;
