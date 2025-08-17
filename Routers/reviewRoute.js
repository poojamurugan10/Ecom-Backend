import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
} from "../Controllers/reviewController.js";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// User adds a review
router.post("/add/:productId", protect, addReview);

// Get all reviews for a product
router.get("/:productId", getProductReviews);

// Admin (or the same user) can delete review
router.delete("/:reviewId", protect, adminProtect, deleteReview);

export default router;
