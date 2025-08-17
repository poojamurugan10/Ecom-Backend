import Review from "../Models/reviewModel.js";
import Product from "../Models/Product.js";

// ✅ Add review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviewExists = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (reviewExists) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get product reviews
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
