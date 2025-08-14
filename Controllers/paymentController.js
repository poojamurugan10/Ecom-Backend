import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

export const createCheckout = async (req, res) => {
  try {
    const { items } = req.body;

    const line_items = items.map((item) => {
      if (!item.product || !item.product.price) {
        throw new Error(
          "Invalid Product Details, Missing product or product price"
        );
      }
      return {
        price_data: {
          currency: "INR",
          product_data: { name: item.product.name },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      };
    });
    const session = await razorpay.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "https://taupe-cuchufli-f5a57c.netlify.app/success",
      cancel_url: "https://taupe-cuchufli-f5a57c.netlify.app/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};