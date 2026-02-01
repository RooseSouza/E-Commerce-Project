const mongoose = require("mongoose");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");
const Notification = require("../models/notification");

/* ================= PLACE ORDER ================= */
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { address } = req.body;

    /* ================= ADDRESS ================= */
    if (!address || !address.houseNumber) {
      throw new Error("Complete address is required");
    }

    const user = await User.findById(userId).session(session);

    let existingAddress = user.addresses.find(
      a =>
        a.houseNumber === address.houseNumber &&
        a.street === address.street &&
        a.city === address.city &&
        a.zip === address.zip
    );

    if (!existingAddress) {
      user.addresses.push(address);
      await user.save({ session });
      existingAddress = user.addresses[user.addresses.length - 1];
    }

    const addressId = existingAddress._id;

    const cart = await Cart.findOne({ userId })
      .populate("items.productId")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
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
        const product = await Product.findById(item.productId._id).session(session);

        if (product.stock.quantity < item.quantity) {
          throw new Error(`Out of stock: ${product.name}`);
        }

        // reduce stock
        product.stock.quantity -= item.quantity;
        await product.save({ session });

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

      createdOrders.push(order[0]);
    }

    /* ================= CLEAR CART ================= */
    cart.items = [];
    await cart.save({ session });

    /* ================= CREATE NOTIFICATIONS ================= */
    console.log("🔔 Creating notifications for user:", userId);
    // Create a notification for each order generated (in case of multiple vendors)
    for (const order of createdOrders) {
      if (order) {
        console.log(`🔔 Notification for Order ID: ${order._id}`);
        await Notification.create([{
          userId,
          title: "Order Placed",
          message: `Your order #${order._id.toString().slice(-6)} has been placed successfully.`,
          orderId: order._id
        }], { session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order placed successfully",
      orders: createdOrders,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

/* ================= GET VENDOR ORDERS ================= */
const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    let orders = await Order.find({ vendorId })
      .populate("userId", "name phone addresses")
      .populate("items.productId", "name price image")
      .sort({ createdAt: -1 });

    orders = orders.map(order => {
      const user = order.userId;
      const selectedAddress = user.addresses.find(
        addr => addr._id.toString() === order.addressId.toString()
      );

      return {
        ...order.toObject(),
        userId: {
          ...user.toObject(),
          selectedAddress: selectedAddress || null
        }
      };
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vendor orders" });
  }
};

/* ================= UPDATE STATUS ================= */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["confirmed", "dispatched", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ _id: id, vendorId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // Create Notification for Status Update
    await Notification.create({
      userId: order.userId,
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order #${order._id.toString().slice(-6)} has been ${status}.`,
      orderId: order._id
    });

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  placeOrder,
  getVendorOrders,
  updateOrderStatus
};
