import Cart from "../Models/cartModel.js";
import sendEmail from "../Utils/mailer.js";

// ✅ Create a New Order (from Cart)
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Your cart is empty" });
    }

    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.user._id,
      products: cart.items,
      totalPrice,
      status: "Pending",
    });

    await order.save();

    // ✅ Clear cart after placing order
    await Cart.findOneAndDelete({ user: req.user._id });

    // ✅ Send email confirmation (non-blocking)
    try {
      const userEmail = req.user.email;
      await sendEmail(
        userEmail,
        "Order Confirmation",
        `✅ Your order of $${totalPrice} has been placed successfully!`
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

// ✅ Get Logged-in User Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "My Orders retrieved",
      data: orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user orders" });
  }
};

// ✅ Get All Orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All Orders retrieved",
      data: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch all orders" });
  }
};

// ✅ Update Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update order status" });
  }
};
