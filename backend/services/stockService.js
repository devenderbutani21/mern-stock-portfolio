import axios from "axios";

const API_KEY = process.env.STOCK_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export const getLiveQuote = async (symbol) => {
  try {
    const API_KEY = process.env.STOCK_API_KEY || 'demo'; // Fallback
    const { data } = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: API_KEY
      }
    });

    console.log(`API response for ${symbol}:`, data); // Debug!

    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error(`No quote data: ${JSON.stringify(data)}`);
    }

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']) || 0,
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
      volume: parseInt(quote['06. volume']) || 0
    };
  } catch (error) {
    console.error(`Alpha Vantage full error for ${symbol}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch ${symbol}: ${error.message}`);
  }
};
