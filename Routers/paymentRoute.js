import express from "express";
import { createCheckout, verifyPayment, cancelOrder } from "../Controllers/paymentController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Checkout
router.post("/checkout", protect, createCheckout);

// ✅ Verify payment
router.post("/verify", protect, verifyPayment);

// ✅ Cancel order
router.put("/cancel/:id", protect, cancelOrder); 

export default router;
