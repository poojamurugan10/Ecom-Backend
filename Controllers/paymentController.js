import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../Models/orderModel.js";

// ✅ Checkout - Create Razorpay Order
export const createCheckout = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // convert to paisa
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ success: false, message: "Checkout failed" });
  }
};



// ✅ Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Update order in DB
    const order = await Order.findById(orderId);
    if (order) {
      order.status = "Paid";
      order.paymentInfo = {
        id: razorpay_payment_id,
        status: "Completed",
      };
      await order.save();
    }

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// ✅ Cancel Order 
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only allow cancelling "Pending" orders
    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "Cancelled";
    order.paymentInfo = null; // clear any pending payment info
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: "Cancel order failed" });
  }
};

