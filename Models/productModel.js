import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
export default mongoose.models.Product || mongoose.model("Product", productSchema);
