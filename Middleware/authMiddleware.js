import jwt from "jsonwebtoken";
import User from "../Models/userModel.js"; 

// Protect middleware: verifies user token
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.toLowerCase().startsWith("bearer")) {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// ✅ Admin middleware: ensures user is admin
export const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};
