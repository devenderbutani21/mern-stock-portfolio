import { Router } from "express";
import { addToWatchList, deleteWatchlistItem, getWatchlist } from "../controllers/watchlistController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// All watchlist routes require login
router.use(auth);

router.post('/', auth, addToWatchList);
router.get('/', auth, getWatchlist);
router.delete('/:id', auth, deleteWatchlistItem);

export default router;