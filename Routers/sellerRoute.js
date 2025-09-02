import express from "express";
import { protect, sellerProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Example Seller Dashboard
router.get("/dashboard", protect, sellerProtect, (req, res) => {
  res.json({ message: "Welcome to Seller Dashboard", user: req.user });
});

export default router;
