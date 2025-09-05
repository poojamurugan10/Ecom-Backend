import Product from "../Models/productModel.js";

//  Get all products (public, with filters, sorting, pagination)
export const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, brand, search, sort, page, limit, seller } = req.query;
    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) query.name = { $regex: search, $options: "i" };
    if (seller) query.sellerId = seller; // ✅ seller filter

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else if (sort === "newest") sortOption.createdAt = -1;

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .populate("sellerId", "name email"); // optional: populate seller info

    res.status(200).json({
      products,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts,
    });
  } catch (error) {
    console.error("❌ Error in getAllProducts:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Create new product (admin or seller)
export const createProduct = async (req, res) => {
  try {
    if (!req.user || !["admin", "seller"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to create product" });
    }

    const product = new Product({
      ...req.body,
      sellerId: req.user._id, // track which seller/admin added it
    });

    const savedProduct = await product.save();
    console.log("✅ Product created:", savedProduct.name);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ Error in createProduct:", error.message);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

//  Update product (admin or owner seller only)
export const updateProduct = async (req, res) => {
  try {
    if (!req.user || !["admin", "seller"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to update product" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Sellers can update only their own products
    if (req.user.role === "seller" && product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    console.log("✅ Product updated:", updatedProduct.name);
    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Error in updateProduct:", error.message);
    res.status(500).json({ message: "Server error while updating product", error: error.message });
  }
};

//  Delete product (admin or owner seller only)
export const deleteProduct = async (req, res) => {
  try {
    if (!req.user || !["admin", "seller"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to delete product" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Sellers can delete only their own products
    if (req.user.role === "seller" && product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();

    console.log("🗑️ Product deleted:", product.name);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteProduct:", error.message);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
