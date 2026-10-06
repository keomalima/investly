import 'dotenv/config';
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const axios = setupCache(Axios.create({
  baseURL: 'https://financialmodelingprep.com/stable/',
  timeout: 15000,
}), { ttl: 5 * 60 * 1000 });

export function normalizeSymbols(stocks) {
  const symbols = [...new Set((Array.isArray(stocks) ? stocks : String(stocks).split(','))
    .map((stock) => String(stock).trim().toUpperCase()).filter(Boolean))];
  if (symbols.length > 50 || symbols.some((symbol) => !/^[A-Z0-9][A-Z0-9.-]{0,14}$/.test(symbol))) {
    const error = new Error('Provide valid stock symbols (maximum 50)');
    error.status = 400;
    throw error;
  }
  return symbols;
}

export function createStockClient(client) {
  async function request(endpoint, params) {
    if (!process.env.FINANCIAL_API_KEY) {
      const error = new Error('Stock data provider is not configured');
      error.status = 503;
      throw error;
    }
    try {
      const response = await client.get(endpoint, {
        params: { ...params, apikey: process.env.FINANCIAL_API_KEY },
      });
      if (!Array.isArray(response.data)) throw new Error('Invalid provider response');
      return response.data;
    } catch (cause) {
      // Never return Axios errors or provider payloads: they can contain the API key.
      const status = cause.response?.status;
      const message = status === 401 || status === 403
        ? 'Stock provider denied access. Check the API key and endpoint permissions in your FMP plan.'
        : status === 429
        ? 'Stock provider request limit reached. Try again later.'
        : 'Failed to fetch stock data from the provider';
      const error = new Error(message);
      error.status = 502;
      throw error;
    }
  }

  async function getStockData(stocks) {
    const symbols = normalizeSymbols(stocks);
    // Stable profile accepts a single symbol; combine results for portfolio consumers.
    const profiles = [];
    for (const symbol of symbols) {
      const data = await request('profile', { symbol });
      profiles.push(...data.map((stock) => ({
        ...stock,
        changes: stock.changes ?? stock.change,
        exchangeShortName: stock.exchangeShortName ?? stock.exchange,
      })));
    }
    return profiles;
  }

  async function getStockHistory(symbol, from, to, interval) {
    const symbols = normalizeSymbols(symbol);
    if (symbols.length !== 1 || !['1min', '5min', '15min', '30min', '1hour', '4hour'].includes(interval)) {
      const error = new Error('Provide one symbol and a supported chart interval');
      error.status = 400;
      throw error;
    }
    const isDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
    if (!isDate(from) || !isDate(to) || from > to) {
      const error = new Error('Provide a valid date range in YYYY-MM-DD format');
      error.status = 400;
      throw error;
    }
    return request(`historical-chart/${interval}`, { symbol: symbols[0], from, to });
  }

  return { getStockData, getStockHistory };
}

export const { getStockData, getStockHistory } = createStockClient(axios);
