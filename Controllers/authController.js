import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Incoming register data:", req.body);

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
      role: role  //  if frontend sends seller, it will save seller
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "User LoggedIn Successfully",
      token,
      role: user.role, // return role to frontend
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
// forgot password

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    //create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    //nodemailer part
    await sendEmail(
      user.email,
      "Password Reset Link",
      `You are receiving this because you have requested the reset password for your account.
      Please click the following link or paste it into your browser to complete the process
      http://localhost:5173/reset-password/${user._id}/${token}
      please ignore you have not requested for reset password.`
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reset password

export const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(404).json({ message: "Invalid token" });
    }
    //hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    //upate the user password in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ message: "Password resetted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};