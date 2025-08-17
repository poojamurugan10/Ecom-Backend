import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please select category"],
    },
    brand: {
      type: String,
      default: "Generic",
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Please add a product image URL"],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto-generated
  }
);

// ✅ Export Product model
const Product = mongoose.model("Product", productSchema);
export default Product;
