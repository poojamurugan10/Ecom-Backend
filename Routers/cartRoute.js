import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  viewCart,
} from "../Controllers/cartController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/view", protect, viewCart);
router.delete("/remove/:productId", protect, removeFromCart);
router.put("/update/:productId", protect, updateCartQuantity);

export default router;
