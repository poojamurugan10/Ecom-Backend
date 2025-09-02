import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("🔍 Trying to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
  mongoose.connection.on("connected", () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
});

};


export default connectDB;
