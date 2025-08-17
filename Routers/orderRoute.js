import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../Controllers/orderController.js";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

//  Create a new order (customer only, must be logged in)
router.post("/", protect, createOrder);

//  Get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

//  Get all orders (admin only)
router.get("/", protect, adminProtect, getAllOrders);

// Update order status (admin only)
router.put("/:id/status", protect, adminProtect, updateOrderStatus);



export default router;
