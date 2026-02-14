# MERN Stock Portfolio – Backend

Backend API for a stock portfolio tracker built with **MongoDB, Express, and Node.js**.  
It powers features like listing stocks and managing a watchlist, and will later support user auth and live stock prices.

## Features (Current)

- List all available stocks from MongoDB (`/api/stocks`)
- Add a stock to a watchlist (`/api/watchlist`)
- ES module (ES26) backend with clean MVC structure
- Local MongoDB replica set (`rs0`) using `stockdb` database

Planned:
- User authentication with JWT
- Live prices via Alpha Vantage API
- Full React frontend (stocks list + watchlist views)

## Tech Stack

- **Backend:** Node.js, Express, ES modules
- **Database:** MongoDB (local, replica set `rs0`, DB: `stockdb`)
- **ORM:** Mongoose
- **Other:** Nodemon, dotenv, CORS

## Project Structure

```bash
backend/
├── models/
│   ├── Stock.js
│   └── Watchlist.js
├── controllers/
│   ├── stockController.js
│   └── watchlistController.js
├── routes/
│   ├── stockRoutes.js
│   └── watchlistRoutes.js
├── server.js
├── package.json
└── .env        # not committed
