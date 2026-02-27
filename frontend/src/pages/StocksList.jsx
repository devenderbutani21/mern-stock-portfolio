import { useEffect, useState } from 'react';
import { stockAPI, watchlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const StocksList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const res = await stockAPI.getAll();
        setStocks(Array.isArray(res.data.stocks) ? res.data.stocks : []);
      } catch (err) {
        console.error('Failed to load stocks:', err);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const handleAddToWatchlist = async (stockId) => {
    try {
      await watchlistAPI.add(stockId);
      setStocks(prev =>
        prev.map(stock =>
          stock._id === stockId
            ? { ...stock, inWatchlist: true }
            : stock
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add');
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[400px] animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center py-4 border-b border-gray-100 last:border-0">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-16 ml-4"></div>
            <div className="h-8 bg-gray-200 rounded w-20 ml-4"></div>
            <div className="h-8 bg-gray-200 rounded w-24 ml-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-emerald-100">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Live Markets
          </h2>
          <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm">
            {getCurrentTime()}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stocks.map((stock) => (
              <tr
                key={stock._id}
                className="hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
              >
                <td className="px-6 py-4">
                  <span className="text-base font-semibold text-gray-900">
                    {stock.company}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-emerald-600">
                    {stock.symbol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xl font-extrabold text-gray-900">
                    {stock.price ? `$${stock.price.toFixed(2)}` : '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {stock.changePercent !== undefined && (
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                        stock.changePercent >= 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {stock.changePercent >= 0 ? (
                        <TrendingUpIcon />
                      ) : (
                        <TrendingDownIcon />
                      )}
                      <span className="ml-1.5">
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {isAuthenticated && (
                    <button
                      onClick={() => handleAddToWatchlist(stock._id)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                      aria-label="Add to watchlist"
                    >
                      <AddIcon />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stocks.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 font-medium">
            No stocks available. Check backend.
          </p>
        </div>
      )}
    </div>
  );
};

export default StocksList;
