import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  viewCart,
  removeOrderItem,   //  Import removeOrderItem
} from "../Controllers/cartController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// ➤ Cart routes
router.post("/add", protect, addToCart);
router.get("/view", protect, viewCart);
router.delete("/remove/:productId", protect, removeFromCart);
router.put("/update/:productId", protect, updateCartQuantity);

// ➤ Order-related cart route
router.delete("/remove-order-item/:orderId/:productId", protect, removeOrderItem);

export default router;
