import { Router } from "express";
import { addToWatchList, getWatchlist } from "../controllers/watchlistController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// All watchlist routes require login
router.use(auth);

router.post('/', addToWatchList);
router.get('/', getWatchlist);

export default router;