import axios from "axios";
import rateLimiter from "../utils/rateLimiter.js";
import cache from "../utils/cache.js";

const API_KEY = process.env.STOCK_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

// Cache TTL for live quotes (5 minutes to reduce API calls while staying reasonably fresh)
const LIVE_QUOTE_TTL = 300000;

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

    // Execute through rate limiter (60 req/sec for Finnhub free tier)
    const data = await rateLimiter.execute(async () => {
      const response = await axios.get(`${BASE_URL}/quote`, {
        params: {
          symbol: normalizedSymbol,
          token: apiKey
        }
      });
      return response.data;
    });

    console.log(`Finnhub response for ${normalizedSymbol}:`, data);

    // Finnhub returns error code if symbol is invalid
    if (data.s === 'error' || !data.c) {
      throw new Error(`Invalid symbol or no data: ${normalizedSymbol}`);
    }

    const result = {
      symbol: normalizedSymbol,
      price: data.c || 0,  // Current price
      change: data.d || 0,  // Change
      changePercent: data.dp || 0,  // Change percent
      volume: data.v || 0,  // Volume
      high: data.h || 0,  // High price of the day
      low: data.l || 0,  // Low price of the day
      open: data.o || 0,  // Open price of the day
      previousClose: data.pc || 0  // Previous close price
    };

    // Cache the result
    cache.set(cacheKey, result, LIVE_QUOTE_TTL);
    console.log(`[CACHED] ${normalizedSymbol}: Queue length: ${rateLimiter.getQueueLength()}`);

    return result;
  } catch (error) {
    console.error(`Finnhub error for ${normalizedSymbol}:`, error.message);
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

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Execute through rate limiter (60 req/sec for Finnhub free tier)
    const data = await rateLimiter.execute(async () => {
      const response = await axios.get(`${BASE_URL}/stock/candle`, {
        params: {
          symbol: normalizedSymbol,
          resolution: 'D',  // Daily candles
          from: startDate.getTime() / 1000,  // Unix timestamp (seconds)
          to: endDate.getTime() / 1000,
          token: apiKey
        }
      });
      return response.data;
    });

    // Check for valid data
    if (data.s === 'no_data' || !data.c || data.c.length === 0) {
      throw new Error(`No historical data for ${normalizedSymbol}`);
    }

    // Finnhub returns arrays: t=timestamps, o=open, h=high, l=low, c=close, v=volume
    const result = data.t.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      price: data.c[index],  // Close price
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      volume: data.v[index]
    })).reverse();  // Most recent first

    // Cache the result
    cache.set(cacheKey, result, HISTORICAL_TTL);
    console.log(`[CACHED] Historical ${normalizedSymbol}`);

    return result;
  } catch (error) {
    console.error(`Historical error for ${normalizedSymbol}:`, error.message);
    throw new Error(`Historical fetch failed: ${error.message}`);
  }
};
