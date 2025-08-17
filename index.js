import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";

import authRoute from "./Routers/authRoute.js";
import productRoute from "./Routers/productRoute.js";
import cartRoute from "./Routers/cartRoute.js";
import orderRoute from "./Routers/orderRoute.js";
import paymentRoute from "./Routers/paymentRoute.js";
import wishlistRoute from "./Routers/wishlistRoute.js";
import reviewRoute from "./Routers/reviewRoute.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",  // local frontend
  "https://ecommwebsite13.netlify.app"  // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies/authorization headers
  })
);

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API!");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/reviews", reviewRoute);

// Start server only after DB is connected
const port = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

});
