import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const cachedAxios = setupCache(Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
}));

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getStockDataAPI(stocks) {
  const response = await cachedAxios.get('/api/stocks/profile', {
    params: { symbol: Array.isArray(stocks) ? stocks.join(',') : stocks },
    headers: authHeaders(),
  });
  return response.data;
}

export async function getStockDataChartAPI(ticker, dateFrom, dateTo, timeFrame) {
  const response = await cachedAxios.get('/api/stocks/history', {
    params: { symbol: ticker, from: dateFrom, to: dateTo, interval: timeFrame },
    headers: authHeaders(),
  });
  return response.data;
}
