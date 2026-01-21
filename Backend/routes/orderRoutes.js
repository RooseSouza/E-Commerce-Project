// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/orders
 * @desc    Place order (splits by vendor)
 * @access  User
 */
router.post("/", protect, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // 1. Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /**
     * 2. Group cart items by vendor
     * {
     *   vendorId1: [items...],
     *   vendorId2: [items...]
     * }
     */
    const vendorMap = {};

    cart.items.forEach(item => {
      const vendorId = item.productId.vendorId.toString();

      if (!vendorMap[vendorId]) {
        vendorMap[vendorId] = [];
      }

      vendorMap[vendorId].push(item);
    });

    const createdOrders = [];

    // 3. Create one order per vendor
    for (const vendorId in vendorMap) {
      const items = vendorMap[vendorId];

      let subtotal = 0;

      const orderItems = items.map(item => {
        subtotal += item.quantity * item.price;
        return {
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price
        };
      });

      const tax = Math.round(subtotal * 0.05); // 5% tax
      const deliveryCharge = subtotal >= 499 ? 0 : 40;
      const totalAmount = subtotal + tax + deliveryCharge;

      const order = await Order.create({
        userId: req.user._id,
        vendorId,
        items: orderItems,
        subtotal,
        tax,
        deliveryCharge,
        totalAmount,
        address,
        status: "placed"
      });

      createdOrders.push(order);
    }

    // 4. Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Orders placed successfully",
      orders: createdOrders
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
