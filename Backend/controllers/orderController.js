const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");

/**
 * @desc    Place order
 * @route   POST /api/orders
 * @access  Private
 */
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    /* ================= ADDRESS ================= */
    if (!address || !address.houseNumber) {
      return res.status(400).json({ message: "Complete address is required" });
    }

    const user = await User.findById(userId);

    let existingAddress = user.addresses.find(
      (a) =>
        a.houseNumber === address.houseNumber &&
        a.street === address.street &&
        a.city === address.city &&
        a.zip === address.zip
    );

    if (!existingAddress) {
      user.addresses.push(address);
      await user.save();
      existingAddress = user.addresses[user.addresses.length - 1];
    }

    const addressId = existingAddress._id;

    /* ================= CART ================= */
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* ================= GROUP BY VENDOR ================= */
    const vendorMap = {};

    cart.items.forEach((item) => {
      const vendorId = item.productId.vendorId.toString();
      if (!vendorMap[vendorId]) vendorMap[vendorId] = [];
      vendorMap[vendorId].push(item);
    });

    const createdOrders = [];

    /* ================= CREATE ORDERS ================= */
    for (const vendorId in vendorMap) {
      let subtotal = 0;
      const orderItems = [];

      for (const item of vendorMap[vendorId]) {
        const product = item.productId; // already populated ✅

        if (product.stock.quantity < item.quantity) {
          return res.status(400).json({
            message: `${product.name} is out of stock`,
          });
        }

        // reduce stock
        product.stock.quantity -= item.quantity;
        await product.save();

        const price = product.price; // ✅ FIXED

        subtotal += item.quantity * price;

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: price, // ✅ REQUIRED FIELD
        });
      }

      const tax = Math.round(subtotal * 0.05);
      const deliveryCharge = subtotal >= 499 ? 0 : 40;
      const totalAmount = subtotal + tax + deliveryCharge;

      const order = await Order.create({
        userId,
        vendorId,
        items: orderItems,
        totalAmount,
        addressId,
        status: "placed",
      });

      createdOrders.push(order);
    }

    /* ================= CLEAR CART ================= */
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      orders: createdOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Vendor gets their orders
 * @route   GET /api/orders/vendor
 * @access  Private
 */
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await Order.find({ vendorId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
