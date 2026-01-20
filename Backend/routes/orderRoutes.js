const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/orders
 * @desc    Place order from cart
 * @access  User
 */
router.post("/", protect, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // 1. Fetch cart
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    let vendorId = null;

    // 2. Build order items
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      vendorId = product.vendorId; // fetched via product
      totalAmount += item.price * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price // snapshot from cart
      });
    }

    // 3. Create order
    const order = await Order.create({
      userId: req.user._id,
      vendorId,
      items: orderItems,
      totalAmount,
      address,
      status: "placed"
    });

    // 4. Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
