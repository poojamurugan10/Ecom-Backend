import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getSellerProducts
} from "../Controllers/productController.js";
import { protect, adminOrSellerProtect, sellerProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

//  Public route (anyone can see products)
router.get("/getproducts", getAllProducts);

//  Seller/Admin routes
router.post("/create", protect, adminOrSellerProtect, createProduct);
router.put("/update/:id", protect, adminOrSellerProtect, updateProduct);
router.get("/seller", protect, sellerProtect, async (req, res) => {
  try {
    const products = await getAllProducts({ sellerId: req.user._id }); // Or filter in controller
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//  Only Admin or Seller can delete
router.delete("/delete/:id", protect, adminOrSellerProtect, deleteProduct);

export default router;
