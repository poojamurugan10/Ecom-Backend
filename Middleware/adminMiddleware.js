import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const adminMiddleware = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token Missing" });
  }

  // Accept both "Bearer <token>" and "<token>"
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(req.user._id);
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access Denied: Admins only" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
