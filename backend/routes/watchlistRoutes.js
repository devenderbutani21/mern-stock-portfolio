import { Router } from "express";
import { addToWatchList, deleteWatchlistItem, getWatchlist } from "../controllers/watchlistController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// All watchlist routes require login
router.use(auth);

router.post('/', addToWatchList);
router.get('/', getWatchlist);
router.delete('/:id', deleteWatchlistItem);

export default router;