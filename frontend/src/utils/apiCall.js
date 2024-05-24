import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

//Makes the call for the external api and caches the response
const instance = Axios.create();
const cachedAxios = setupCache(instance);

export async function getStockDataAPI(stocks) {
  try {
    const response = await cachedAxios.get(
      `/api/fmp-proxy/v3/profile/${stocks}`,
      {
        params: {
          apikey: import.meta.env.VITE_FINANCIAL_API_KEY,
        },
        headers: {
          // Set Pragma header only for the actual request (GET), not for preflight (OPTIONS)
          ...(typeof window !== 'undefined' ? { Pragma: 'no-cache' } : {}),
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
      `/api/fmp-proxy/v3/profile/historical-chart/${timeFrame}/${ticker}`,
      {
        params: {
          apikey: import.meta.env.VITE_FINANCIAL_API_KEY,
          from: dateFrom,
          to: dateTo,
        },
        headers: {
          // Set Pragma header only for the actual request (GET), not for preflight (OPTIONS)
          ...(typeof window !== 'undefined' ? { Pragma: 'no-cache' } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stock historical data from the API');
  }
}
