import Wishlist from "../Models/wishlistModel.js";
import Product from "../Models/productModel.js";

//  Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
};

//  Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Prevent duplicate entries
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    wishlist = await wishlist.populate("products");

    res.json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
};

//  Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    wishlist = await wishlist.populate("products");

    res.json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error: error.message });
  }
};
