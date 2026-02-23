import { useEffect, useState } from "react";
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
    CircularProgress,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/PlaylistAdd';
import { stockAPI, watchlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const res = await stockAPI.getAll();
                setStocks(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load stocks');
            } finally {
                setLoading(false);
            }
        };
        fetchStocks();
    }, []);

    const handleAddToWatchlist = async (stockId) => {
        try {
            await watchlistAPI.add(stockId);
            alert('Added to watchlist');
        } catch(err) {
            alert(err.response?.data?.error || 'Failed to add');
        }
    };

    const getChangeColor = (changePercent) =>
        changePercent >= 0 ? 'success' : 'error';

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    All Stocks
                </Typography>
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
                        {stocks.map((stock) => (
                            <TableRow key={stock._id}>
                                <TableCell>{stock.company}</TableCell>
                                <TableCell>{stock.symbol}</TableCell>
                                <TableCell>
                                    {stock.price ? `$${stock.price.toFixed(2)}` : '-' }
                                </TableCell>
                                <TableCell>
                                    {stock.changePercent !== undefined && (
                                        <Chip
                                            label={`${stock.changePercent.toFixed(2)}`}
                                            color={getChangeColor(stock.changePercent)}
                                            size="small"
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {isAuthenticated && (
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleAddToWatchlist(stock._id)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default StockList;