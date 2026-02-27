# MERN Stock Portfolio

A full-stack stock portfolio tracker built with the **MERN stack** (MongoDB, Express, React, Node.js). This application provides real-time stock price tracking, watchlist management, and secure user authentication.

## Features

- **Live Market Data:** Real-time stock quotes via Finnhub API with optimized rate limiting and caching.
- **Dynamic Stocks List:** View live market prices, daily changes, and company details with a polished Material UI interface.
- **Personal Watchlist:** Securely save and track your favorite stocks.
- **User Authentication:** Robust JWT-based authentication system for private watchlists.
- **Performance Optimized:** Advanced server-side caching and request queuing to handle API rate limits gracefully.
- **Resilient Fallbacks:** Intelligent fallback to historical or cached data if the external API is unavailable.

## Tech Stack

- **Frontend:** React 18+, Material UI (MUI), Axios, React Context API.
- **Backend:** Node.js, Express, ES Modules.
- **Database:** MongoDB (Local/Atlas) with Mongoose ODM.
- **External API:** Finnhub (Stock Data).
- **Security:** JWT Authentication, Bcrypt password hashing, Express Rate Limit.

## Project Structure

```bash
├── backend/
│   ├── controllers/    # Request handlers (Auth, Stocks, Watchlist)
│   ├── middleware/     # Auth, Admin, and Error Handling
│   ├── models/         # Mongoose Schemas (User, Stock, Watchlist)
│   ├── routes/         # API Endpoints
│   ├── services/       # External API logic (Finnhub)
│   ├── utils/          # Caching and Rate Limiting utilities
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── context/    # Auth state management
    │   ├── pages/      # Main views (StocksList, Watchlist, Login)
    │   ├── services/   # API abstraction layer
    │   └── App.js      # Routing and layout
```

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository**

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STOCK_API_KEY=your_finnhub_api_key
   ```

   **Get your Finnhub API key:**
   - Visit [https://finnhub.io/](https://finnhub.io/)
   - Sign up for a free account
   - Go to Dashboard → API Key
   - Free tier: 60 requests/minute, 30,000 requests/month

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

- **Start Backend:** `cd backend && npm start`
- **Start Frontend:** `cd frontend && npm start`

The application will be available at `http://localhost:3000`.

## API Endpoints

### Stocks
- `GET /api/stocks` - Get all stocks with live quotes
- `GET /api/stocks/:symbol` - Get single stock by symbol
- `GET /api/stocks/:symbol/history?days=30` - Get historical data
- `POST /api/stocks` - Create new stock (admin only)

### Cache Management
- `GET /api/stocks/cache/status` - Get cache statistics
- `POST /api/stocks/cache/clear` - Clear cache (admin only)

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add stock to watchlist
- `DELETE /api/watchlist/:id` - Remove from watchlist

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Finnhub API Features

The app uses Finnhub's free tier which provides:
- **Real-time quotes** - Current price, change, volume, high/low
- **Historical data** - Daily candle data (open, high, low, close, volume)
- **60 requests/minute** - Generous rate limit for personal projects
- **Global markets** - US stocks, forex, crypto support

## Caching & Rate Limiting

- **Live quotes:** Cached for 1 minute to balance freshness and API usage
- **Historical data:** Cached for 5 minutes as it changes less frequently
- **Rate limiter:** Queue-based system prevents exceeding API limits
