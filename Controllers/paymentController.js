import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

let razorpay = null;

// Initialize Razorpay only if keys exist
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.error("❌ Razorpay keys are missing in environment variables");
}

export const createCheckout = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount provided" });
    }

    if (!razorpay) {
      return res.status(500).json({
        message: "Razorpay not initialized. Check your environment variables.",
      });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Checkout error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return res.status(500).json({
      message: error.message || "Something went wrong",
      errorName: error.name,
      stack: error.stack,
    });
  }
};
