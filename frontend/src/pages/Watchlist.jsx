import { useEffect, useState } from 'react';
import { watchlistAPI, stockAPI } from '../services/api';

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const res = await watchlistAPI.getAll();
      const watchlistItems = Array.isArray(res.data.data) ? res.data.data : [];
      const itemsWithLive = await Promise.all(
        watchlistItems.map(async (item) => {
          try {
            const res = await stockAPI.getOne(item.stockId.symbol || item.stockId);
            return { ...item, stock: res.data };
          } catch {
            return item;
          }
        })
      );
      setItems(itemsWithLive);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleDelete = async (id) => {
    try {
      await watchlistAPI.remove(id);
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[400px] animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
          <div className="h-10 bg-gray-200 rounded-full w-10"></div>
        </div>
        {[...Array(3)].map((_, i) => (
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
            My Watchlist
          </h2>
          <button
            onClick={loadWatchlist}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
            aria-label="Refresh"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-gray-500">
            Add stocks from the Stocks page to get started
          </p>
        </div>
      ) : (
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
              {items.map((item) => {
                const stock = item.stock || (typeof item.stockId === 'object' ? item.stockId : {});
                return (
                  <tr
                    key={item._id}
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
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                          )}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        aria-label="Remove from watchlist"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
