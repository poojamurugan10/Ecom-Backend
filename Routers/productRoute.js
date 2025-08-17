import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../Controllers/productController.js";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Create product (admin only)
router.post("/create", protect, adminProtect, createProduct);

// Get all products (public)
router.get("/getproducts", getAllProducts);

// Update product (admin only)
router.put("/update/:id", protect, adminProtect, updateProduct);

// Delete product (admin only)
router.delete("/delete/:id", protect, adminProtect, deleteProduct);

export default router;
