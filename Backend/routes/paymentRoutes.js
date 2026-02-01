const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/payments/dummy
 * @desc    Dummy payment & update order status to confirmed
 * @access  User
 */
router.post("/dummy", protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({ message: "Payment already exists for this order" });
    }

    // Always mark dummy payment as success
    const payment = await Payment.create({
      orderId,
      paymentStatus: "success"
    });

    // Update order status to confirmed
    order.status = "confirmed";
    await order.save();

    res.status(200).json({
      message: "Dummy payment successful",
      payment,
      orderId: order._id,
      orderStatus: order.status
    });

  } catch (error) {
    console.error("DUMMY PAYMENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
