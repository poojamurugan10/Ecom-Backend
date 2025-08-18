import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  // ✅ Check if Authorization header exists and starts with Bearer
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user (excluding password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found, unauthorized" });
      }

      req.user = user; // Attach user to request
      return next();

    } catch (error) {
      console.error("Auth error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please login again" });
      }

      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  // ❌ No token provided
  return res.status(401).json({ message: "No token, authorization denied" });
};

// ✅ Admin check middleware
export const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access Denied: Admins only" });
};
