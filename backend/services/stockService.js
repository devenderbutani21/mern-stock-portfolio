import axios from "axios";
import rateLimiter from "../utils/rateLimiter.js";
import cache from "../utils/cache.js";

const API_KEY = process.env.STOCK_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Cache TTL for live quotes (1 minute to stay fresh but reduce API calls)
const LIVE_QUOTE_TTL = 60000;

export const getLiveQuote = async (symbol, useCache = true) => {
  const normalizedSymbol = symbol.toUpperCase();
  const cacheKey = `quote:${normalizedSymbol}`;

  // Check cache first if enabled
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${normalizedSymbol}: Returning cached quote`);
      return cached;
    }
    console.log(`[CACHE MISS] ${normalizedSymbol}: Fetching from API`);
  }

  try {
    const apiKey = process.env.STOCK_API_KEY || 'demo';
    
    // Execute through rate limiter (1 req/sec)
    const data = await rateLimiter.execute(async () => {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: normalizedSymbol,
          apikey: apiKey
        }
      });
      return response.data;
    });

    console.log(`API response for ${normalizedSymbol}:`, data);

    const quote = data['Global Quote'];
    if (!quote) {
      // Check if it's a rate limit message
      if (data.Information) {
        throw new Error(`Alpha Vantage rate limit: ${data.Information}`);
      }
      throw new Error(`No quote data: ${JSON.stringify(data)}`);
    }

    const result = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']) || 0,
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
      volume: parseInt(quote['06. volume']) || 0
    };

    // Cache the result
    cache.set(cacheKey, result, LIVE_QUOTE_TTL);
    console.log(`[CACHED] ${normalizedSymbol}: Queue length: ${rateLimiter.getQueueLength()}`);

    return result;
  } catch (error) {
    console.error(`Alpha Vantage error for ${normalizedSymbol}:`, error.message);
    throw new Error(`Failed to fetch ${normalizedSymbol}: ${error.message}`);
  }
};

// Cache TTL for historical data (5 minutes - doesn't change as frequently)
const HISTORICAL_TTL = 300000;

export const getHistoricalData = async (symbol, days = 30, useCache = true) => {
  const normalizedSymbol = symbol.toUpperCase();
  const cacheKey = `historical:${normalizedSymbol}:${days}`;

  // Check cache first if enabled
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] Historical ${normalizedSymbol}: Returning cached data`);
      return cached;
    }
  }

  try {
    const apiKey = process.env.STOCK_API_KEY || 'demo';

    // Execute through rate limiter (1 req/sec)
    const data = await rateLimiter.execute(async () => {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: normalizedSymbol,
          outputsize: 'compact',
          apikey: apiKey
        }
      });
      return response.data;
    });

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      if (data.Information) {
        throw new Error(`Alpha Vantage rate limit: ${data.Information}`);
      }
      throw new Error('No historical data');
    }

    const result = Object.entries(timeSeries)
      .slice(0, days)
      .map(([date, values]) => ({
        date,
        price: parseFloat(values['4. close'])
      }));

    // Cache the result
    cache.set(cacheKey, result, HISTORICAL_TTL);
    console.log(`[CACHED] Historical ${normalizedSymbol}`);

    return result;
  } catch (error) {
    console.error(`Historical error for ${normalizedSymbol}:`, error.message);
    throw new Error(`Historical fetch failed: ${error.message}`);
  }
};