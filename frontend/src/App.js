import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import StockList from './pages/StocksList';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Router>
      <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Stock Portfolio
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/stocks"
                className="text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Stocks
              </Link>
              <Link
                to="/watchlist"
                className="text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Watchlist
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<StockList />} />
          <Route path="/stocks" element={<StockList />} />
          <Route
            path="/watchlist"
            element={
              <PrivateRoute>
                <Watchlist />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
