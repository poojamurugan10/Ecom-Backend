import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../Controllers/productController.js";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Get all products (public)
router.get("/getproducts", getAllProducts);

// Admin routes
router.post("/create", protect, adminProtect, createProduct);
router.put("/update/:id", protect, adminProtect, updateProduct);
router.delete("/delete/:id", protect, adminProtect, deleteProduct);

export default router;
