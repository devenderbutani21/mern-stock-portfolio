import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { watchlistAPI } from '../services/api';

const Watchlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadWatchlist = async () => {
        try {
            const res = await watchlistAPI.getAll();
            setItems(res.data);
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
            setItems((prev) => prev.filter((i) => i._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to remove');
        }
    };

    const getChangeColor = (changePercent) => 
        changePercent >= 0 ? 'success' : 'error';

    return (
        <Card>
            <CardContent>
                <Typography variant='h5' gutterBottom>
                    My Watchlist
                </Typography>
                {items.length === 0 ? (
                    <Typography>No items yet. Add from Stocks page.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>Company</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Change %</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                            <TableBody>
                            {items.map((item) => {
                                const stock = item.stockId || item.stock || {}; // depending on backend populate
                                return (
                                <TableRow key={item._id}>
                                    <TableCell>{stock.company}</TableCell>
                                    <TableCell>{stock.symbol}</TableCell>
                                    <TableCell>
                                    {stock.price ? `$${stock.price.toFixed(2)}` : '—'}
                                    </TableCell>
                                    <TableCell>
                                    {stock.changePercent !== undefined && (
                                        <Chip
                                        label={`${stock.changePercent.toFixed(2)}%`}
                                        color={getChangeColor(stock.changePercent)}
                                        size="small"
                                        />
                                    )}
                                    </TableCell>
                                    <TableCell align="right">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(item._id)}
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
    );
}

export default Watchlist;