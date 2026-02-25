// src/pages/StocksList.jsx (replace your version)
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Skeleton,
  Box,
  Fade,
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutlineRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { stockAPI, watchlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StocksList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const res = await stockAPI.getAll();
        // Backend returns { stocks: [...], queueLength, cacheStats }
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
      // Optimistic update
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

  const getChangeColor = (changePercent) =>
    changePercent >= 0 ? 'success' : 'error';

  if (loading) {
    return (
      <Card sx={{ height: 400 }}>
        <CardContent>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton variant="rectangular" height={50} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in={!loading} timeout={600}>
      <Card sx={{ minHeight: 400 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, flexGrow: 1 }}>
              Live Markets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleTimeString()}
            </Typography>
          </Box>

          <Table sx={{ '& .MuiTableCell-root': { py: 2.5 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Company
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Symbol
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Change
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock, index) => (
                <TableRow 
                  key={stock._id}
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" fontWeight={600}>
                      {stock.company}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                      {stock.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5" fontWeight={800} color="text.primary">
                      {stock.price ? `$${stock.price.toFixed(2)}` : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {stock.changePercent !== undefined && (
                      <Chip
                        label={`${stock.changePercent.toFixed(2)}%`}
                        color={getChangeColor(stock.changePercent)}
                        icon={
                          stock.changePercent >= 0 ? (
                            <TrendingUpIcon fontSize="small" />
                          ) : (
                            <TrendingDownIcon fontSize="small" />
                          )
                        }
                        sx={{ fontSize: '0.875rem', fontWeight: 700 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {isAuthenticated && (
                      <IconButton
                        onClick={() => handleAddToWatchlist(stock._id)}
                        sx={{ 
                          bgcolor: 'rgba(16,185,129,0.1)',
                          '&:hover': { bgcolor: 'primary.main', color: 'white' }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {stocks.length === 0 && !loading && (
            <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
              No stocks available. Check backend.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StocksList;
