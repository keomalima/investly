import dotenv from 'dotenv';
dotenv.config();
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const instance = Axios.create();
const axios = setupCache(instance);

export async function getStockData(stocks) {
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/profile/${stocks}`,
      {
        params: {
          apikey: import.meta.env.VITE_FINANCIAL_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stock data from the API');
  }
}
