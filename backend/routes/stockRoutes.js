import { Router } from 'express';
import { createStock, getAllStocks, getStockBySymbol, getHistorical } from '../controllers/stockController.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

router.get('/', getAllStocks);
router.get('/:symbol', getStockBySymbol);
router.post('/', isAdmin, createStock);
router.get('/:symbol/history', getHistorical);

export default router;