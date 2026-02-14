import { Router } from "express";
import { addToWatchList } from "../controllers/watchlistController.js";

const router = Router();

router.post('/', addToWatchList);

export default router;