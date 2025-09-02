import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../Controllers/productController.js";
import { protect, adminOrSellerProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

//  Public route (anyone can see products)
router.get("/getproducts", getAllProducts);

//  Seller/Admin routes
router.post("/create", protect, adminOrSellerProtect, createProduct);
router.put("/update/:id", protect, adminOrSellerProtect, updateProduct);

//  Only Admin or Seller can delete
router.delete("/delete/:id", protect, adminOrSellerProtect, deleteProduct);

export default router;
