import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

// Middleware to verify token & attach user
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found, unauthorized" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please login again" });
      }

      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

//  Generic Role-based Access Control middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: `Access Denied: ${roles.join(" / ")} only` });
  };
};

//  Predefined role middlewares for easy use
export const adminProtect = authorizeRoles("admin");
export const sellerProtect = authorizeRoles("seller");

// Combined Admin or Seller Access
export const adminOrSellerProtect = authorizeRoles("admin", "seller");
