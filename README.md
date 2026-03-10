# MERN Stock Portfolio

A full-stack stock portfolio tracker built with the **MERN stack** (MongoDB, Express, React, Node.js). This application provides real-time stock price tracking, watchlist management, and secure user authentication.

## Features

- **Live Market Data:** Real-time stock quotes via Finnhub API with optimized rate limiting and caching.
- **Dynamic Stocks List:** View live market prices, daily changes, and company details with a modern Tailwind CSS interface.
- **Personal Watchlist:** Securely save and track your favorite stocks.
- **User Authentication:** Robust JWT-based authentication system for private watchlists.
- **Performance Optimized:** Advanced server-side caching and request queuing to handle API rate limits gracefully.
- **Resilient Fallbacks:** Intelligent fallback to historical or cached data if the external API is unavailable.
- **Modern UI:** Clean, responsive design built with Tailwind CSS featuring gradients, animations, and smooth transitions.

## Tech Stack

### Frontend
- **React 18+** - UI library
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **ES Modules** - Modern JavaScript modules

### Database
- **MongoDB** - NoSQL database (Local/Atlas)
- **Mongoose** - ODM for MongoDB

### External API
- **Finnhub** - Real-time stock market data

### Security
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Express Rate Limit** - API rate limiting

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
    │   ├── context/    # Auth state management (AuthContext)
    │   ├── pages/      # Main views (StocksList, Watchlist, Login, Register)
    │   ├── services/   # API abstraction layer (api.js)
    │   ├── App.js      # Main app with routing
    │   └── index.js    # Entry point
    ├── tailwind.config.js  # Tailwind CSS configuration
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js installed (v14+)
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

- **Live quotes:** Cached for 5 minutes to reduce API calls while staying fresh
- **Historical data:** Cached for 5 minutes as it changes less frequently
- **Rate limiter:** Queue-based system (10 req/sec) prevents exceeding API limits
- **Invalid symbols:** GPS and TWX removed from database (no longer valid on Finnhub)

## Tailwind CSS Configuration

### Custom Theme (`tailwind.config.js`)

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          500: '#10b981',  // Emerald green
          600: '#059669',
          700: '#047857',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
```

### Design System

| Element | Style |
|---------|-------|
| **Primary Color** | Emerald green (`#10b981`) |
| **Gradient** | `from-emerald-600 to-teal-600` |
| **Border Radius** | `rounded-xl` (12px), `rounded-3xl` (24px) |
| **Shadows** | `shadow-lg`, `shadow-2xl` with color tints |
| **Typography** | System fonts (SF Pro, Segoe UI, Roboto) |

### Key Components

**Navigation Bar**
- Gradient background (emerald to teal)
- Sticky positioning
- Hover effects on links

**Cards**
- White background with rounded corners
- Large shadows for depth
- Smooth hover animations

**Buttons**
- Gradient backgrounds
- Shadow effects with color tints
- Loading states with spinners

**Tables**
- Clean row separators
- Hover effects on rows
- Color-coded price changes (green/red)

**Forms**
- Rounded input fields
- Focus rings with emerald color
- Error state alerts

## Bundle Size

After migrating from Material UI to Tailwind CSS:

| Before (MUI) | After (Tailwind) | Reduction |
|--------------|------------------|-----------|
| ~168 kB | ~97 kB | **74 kB (44%)** |

## Screenshots

### Stocks List
- Live market prices with real-time updates
- Color-coded price changes (green ↑ red ↓)
- Add to watchlist functionality

### Watchlist
- Personal stock tracking
- One-click removal
- Auto-refresh capability

### Authentication
- Modern login/register forms
- Gradient backgrounds
- Loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning or personal use.
