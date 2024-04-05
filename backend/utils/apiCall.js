import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function getStockData(stocks) {
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/profile/${stocks}`,
      {
        params: {
          apikey: process.env.FINANCIAL_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stock data from the API');
  }
}
