import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  viewCart,
} from "../Controllers/cartController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/view", authMiddleware, viewCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.put("/update/:productId", authMiddleware, updateCartQuantity);

export default router;