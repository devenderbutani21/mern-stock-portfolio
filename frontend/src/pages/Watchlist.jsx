// src/pages/Watchlist.jsx (replace)
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
  IconButton,
  Skeleton,
  Chip,
  Fade,
  Box,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { watchlistAPI, stockAPI } from '../services/api';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const res = await watchlistAPI.getAll();
      const watchlistItems = Array.isArray(res.data.data) ? res.data.data : [];
      // Refresh live prices for each watchlist item
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              My Watchlist
            </Typography>
            <IconButton onClick={loadWatchlist} sx={{ color: 'text.secondary' }}>
              <RefreshIcon />
            </IconButton>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your watchlist is empty
              </Typography>
              <Typography variant="body2">
                Add stocks from the Stocks page to get started
              </Typography>
            </Box>
          ) : (
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
                {items.map((item) => {
                  const stock = item.stock || (typeof item.stockId === 'object' ? item.stockId : {});
                  return (
                    <TableRow 
                      key={item._id}
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
                            sx={{ fontSize: '0.875rem', fontWeight: 700 }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleDelete(item._id)}
                          sx={{ 
                            bgcolor: 'rgba(239,83,80,0.1)',
                            '&:hover': { bgcolor: 'error.main', color: 'white' }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default Watchlist;
