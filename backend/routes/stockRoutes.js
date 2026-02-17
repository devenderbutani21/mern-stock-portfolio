import { Router } from 'express';
import { getAllStocks, getStockBySymbol } from '../controllers/stockController.js';

const router = Router();

router.get('/', getAllStocks);
router.get('/:symbol', getStockBySymbol);

export default router;