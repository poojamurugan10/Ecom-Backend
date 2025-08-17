import Product from "../Models/productModel.js";


// Get all products (public)
export const getAllProducts = async (req, res) => {
  try {
    console.log("📦 Fetching all products...");

    const products = await Product.find({});

    if (!products || products.length === 0) {
      console.log("⚠️ No products found in database");
      return res.status(404).json({ message: "No products found" });
    }

    console.log(`✅ Found ${products.length} products`);
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error in getAllProducts:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ✅ Create new product (admin)
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ Error in createProduct:", error.message);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

// ✅ Update product (admin)
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Error in updateProduct:", error.message);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

// ✅ Delete product (admin)
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteProduct:", error.message);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
