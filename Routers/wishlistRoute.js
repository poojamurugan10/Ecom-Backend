import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../Controllers/wishlistController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);

export default router;
