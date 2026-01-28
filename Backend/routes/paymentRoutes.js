const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/payments
 * @desc    Dummy payment & update order status
 * @access  User
 */
router.post("/", protect, async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    if (!orderId || !paymentStatus) {
      return res.status(400).json({
        message: "orderId and paymentStatus are required"
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already exists for this order"
      });
    }

    
    const payment = await Payment.create({
      orderId,
      paymentStatus
    });

 
    if (paymentStatus === "success") {
      order.status = "confirmed";
      await order.save();
    }

    res.status(200).json({
      message: "Payment processed successfully",
      payment,
      orderStatus: order.status
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
