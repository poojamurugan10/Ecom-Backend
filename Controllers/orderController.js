import Order from "../Models/orderModel.js";
import Cart from "../Models/cartModel.js";
import sendEmail from "../Utils/mailer.js";

// placing an order

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
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

    if (cart) {
      await Cart.findOneAndDelete({ user: req.user._id });
    }

    try {
      const userEmail = req.user.email;
      await sendEmail(
        userEmail,
        "Order Confirmation",
        `Your order of $${totalPrice} is confirmed!`
      );
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
    }

    res.status(200).json({ message: "Order Placed Successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get my order details

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product"
    );

    res.status(200).json({ message: "My Orders retrieved", data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all orders - admin

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");

    res.status(200).json({ message: "All Orders retrieved", data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update order status - admin

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updateOrder) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    res
      .status(200)
      .json({ message: "Order Status Updated", data: updateOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};