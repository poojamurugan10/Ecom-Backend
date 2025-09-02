import express from "express";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Example Admin Dashboard
router.get("/dashboard", protect, adminProtect, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

export default router;
