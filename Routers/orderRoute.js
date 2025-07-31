import express from "express";

import {
  getAllOrders,
  getMyOrders,
  placeOrder,
  updateOrderStatus,
} from "../Controllers/orderController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, placeOrder);
router.get("/myorders", authMiddleware, getMyOrders);
router.get("/allorders", adminMiddleware, getAllOrders);
router.put("/update/:id", adminMiddleware, updateOrderStatus);

export default router;