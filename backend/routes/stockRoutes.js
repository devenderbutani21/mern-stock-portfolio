import { Router } from 'express';
import { 
    createStock, 
    getAllStocks, 
    getStockBySymbol, 
    getHistorical,
    getCacheStatus,
    clearCache 
} from '../controllers/stockController.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

router.get('/', getAllStocks);
router.get('/:symbol', getStockBySymbol);
router.get('/:symbol/history', getHistorical);
router.post('/', isAdmin, createStock);

// Cache management endpoints
router.get('/cache/status', getCacheStatus);
router.post('/cache/clear', isAdmin, clearCache);

export default router;