import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

//Makes the call for the external api and caches the response
const instance = Axios.create();
const axios = setupCache(instance);

export async function getStockDataAPI(stocks) {
  try {
    const response = await axios.get(`/fmp-api/v3/profile/${stocks}`, {
      params: {
        apikey: import.meta.env.VITE_FINANCIAL_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stock data from the API');
  }
}
