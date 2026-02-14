import { Router } from 'express';
import { getAllStocks } from '../controllers/stockController.js';

const router = Router();

router.get('/', getAllStocks);

export default router;