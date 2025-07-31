import Product from "../Models/productModel.js";

//create product

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res
      .status(200)
      .json({ message: "Product created successfully",product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all products

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update product

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock, image } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, stock, image },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};