# MERN Stock Portfolio

A full-stack stock portfolio tracker built with the **MERN stack** (MongoDB, Express, React, Node.js). This application provides real-time stock price tracking, watchlist management, and secure user authentication.

## Features

- **Live Market Data:** Real-time stock quotes via Alpha Vantage API with optimized rate limiting and caching.
- **Dynamic Stocks List:** View live market prices, daily changes, and company details with a polished Material UI interface.
- **Personal Watchlist:** Securely save and track your favorite stocks.
- **User Authentication:** Robust JWT-based authentication system for private watchlists.
- **Performance Optimized:** Advanced server-side caching and request queuing to handle API rate limits gracefully.
- **Resilient Fallbacks:** Intelligent fallback to historical or cached data if the external API is unavailable.

## Tech Stack

- **Frontend:** React 18+, Material UI (MUI), Axios, React Context API.
- **Backend:** Node.js, Express, ES Modules.
- **Database:** MongoDB (Local/Atlas) with Mongoose ODM.
- **External API:** Alpha Vantage (Stock Data).
- **Security:** JWT Authentication, Bcrypt password hashing, Express Rate Limit.

## Project Structure

```bash
├── backend/
│   ├── controllers/    # Request handlers (Auth, Stocks, Watchlist)
│   ├── middleware/     # Auth, Admin, and Error Handling
│   ├── models/         # Mongoose Schemas (User, Stock, Watchlist)
│   ├── routes/         # API Endpoints
│   ├── services/       # External API logic (Alpha Vantage)
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
   STOCK_API_KEY=your_alpha_vantage_key
   ```
3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

- **Start Backend:** `cd backend && npm start`
- **Start Frontend:** `cd frontend && npm start`

The application will be available at `http://localhost:3000`.
