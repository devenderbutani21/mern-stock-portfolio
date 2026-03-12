import { useState, useEffect } from "react";
import { stockAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { watchlistAPI } from "../services/api";

const SearchBar = ({ onStockSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(()=> {
        const delayDebounce = setTimeout(async () => {
            if(query.trim().length >= 2) {
                setLoading(true);
                try {
                    const res = await stockAPI.search(query);
                    setResults(res.data.stocks || []);
                    setShowResults(true);
                } catch(error) {
                    console.error('Search Failed:', error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleAddToWatchList = async (e, stockId) => {
        e.stopPropagation();
        try {
            await watchlistAPI.add(stockId);
            alert('Added to watchlist!');
        } catch (err) { 
            alert(err.response?.data?.error || 'Failed to add')
        }
    };

    const handleSelect = (stock) => {
        if (onStockSelect) onStockSelect(stock);
        setQuery('');
        setShowResults(false);
    };

    return(
        <div className="relative w-full max-w-2xl">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search stocks by symbol or company"
                    className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-emerald-500/30 dark:focus:ring-emerald-500/20 focus:border-emerald-500
            transition-all duration-200 outline-none"
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                <svg 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-emerald-500
                                        border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800
                          rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700
                          max-h-96 overflow-y-auto z-50">
                {results.map((stock) => (
                    <div
                    key={stock._id}
                    onClick={() => handleSelect(stock)}
                    className="flex items-center justify-between px-4 py-3
                          hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                          transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                    >
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{stock.symbol}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stock.company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="font-semibold text-gray-900 dark:text-white">
                        ${stock.price?.toFixed(2) || 'N/A'}
                        </p>
                        {isAuthenticated && (
                        <button
                            onClick={(e) => handleAddToWatchList(e, stock._id)}
                            className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400
                                    rounded-lg hover:bg-emerald-600 hover:text-white
                                    transition-all"
                        >
                            + Watch
                        </button>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            )}

            {showResults && query && results.length === 0 && !loading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800
                                rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No stocks found for {query}</p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;