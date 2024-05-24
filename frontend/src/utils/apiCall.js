import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

// Set up Axios instance with caching
const instance = Axios.create();
const cachedAxios = setupCache(instance);

// Fetch stock profile data with caching
export async function getStockDataAPI(stocks) {
  try {
    const response = await cachedAxios.get(
      `${import.meta.env.VITE_API_STOCK_BASE_URL}/v3/profile/${stocks}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token', // Include authorization if needed
          pragma: 'no-cache', // Ensure pragma header is included if needed
        },
        withCredentials: true, // Include credentials in the request
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

// Fetch historical stock data with caching
export async function getStockDataChartAPI(
  ticker,
  dateFrom,
  dateTo,
  timeFrame
) {
  try {
    const response = await cachedAxios.get(
      `${
        import.meta.env.VITE_API_STOCK_BASE_URL
      }/historical-chart/${timeFrame}/${ticker}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token', // Include authorization if needed
          pragma: 'no-cache', // Ensure pragma header is included if needed
        },
        withCredentials: true, // Include credentials in the request
        params: {
          apikey: import.meta.env.VITE_FINANCIAL_API_KEY,
          from: dateFrom,
          to: dateTo,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stock historical data from the API');
  }
}
