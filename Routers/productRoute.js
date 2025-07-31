import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../Controllers/productController.js";

import { adminMiddleware } from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.post("/create", adminMiddleware, createProduct);
router.get("/getproducts", getAllProducts);
router.put("/update/:id", adminMiddleware, updateProduct);
router.delete("/delete/:id", adminMiddleware, deleteProduct);

export default router;