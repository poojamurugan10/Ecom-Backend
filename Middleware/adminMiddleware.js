import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const adminMiddleware = async (req, res, next) => {
  //const token = req.header("Authorization");
  const token = req.headers.authorization?.split(" ")[1]; // split('')[1] =>bearer token

  if (!token) {
    return res.status(404).json({ message: "Token Missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded", decoded);
    req.user = decoded;
    //console.log("req.user", req.user);
    const user = await User.findById(req.user._id);
    if (user.role === "admin") {
      next();
    } else {
      res.status(404).json({ message: "Access Denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};