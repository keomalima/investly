import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

//Makes the call for the external api and caches the response
const instance = Axios.create();
const cachedAxios = setupCache(instance);

export async function getStockDataAPI(stocks) {
  try {
    const response = await cachedAxios.get(
      `${import.meta.env.VITE_API_STOCK_BASE_URL}/v3/profile/${stocks}`,
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
