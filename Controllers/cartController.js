import Cart from "../Models/cartModel.js";
import Product from "../Models/productModel.js";
import Order from "../Models/orderModel.js"; // ✅ Import Order model

//  Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if product already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalPrice += product.price * quantity;
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  View cart
export const viewCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res
        .status(200)
        .json({ message: "Cart is empty", data: { items: [] } });
    }

    res.status(200).json({ message: "Cart retrieved", data: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const removedItem = cart.items.splice(itemIndex, 1)[0];
      cart.totalPrice -= removedItem.quantity * (await Product.findById(productId)).price;
      await cart.save();

      res.status(200).json({ message: "Item removed from cart", cart });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Remove product from an order
export const removeOrderItem = async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Remove product from order
    order.items = order.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate total price
    order.totalPrice = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await order.save();

    res.json({ message: "Product removed from order", order });
  } catch (error) {
    res.status(500).json({ message: "Error removing product from order", error: error.message });
  }
};

//  Update cart quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { change } = req.body; // +1 or -1

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += change;

      // Remove if quantity becomes 0
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }

      cart.totalPrice += change * (await Product.findById(productId)).price;
      await cart.save();

      res.status(200).json({ message: "Cart updated", cart });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
