const Payment = require("../models/payment");
const Order = require("../models/order");

exports.makePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await Payment.create({
      orderId,
      paymentStatus: "Success"
    });

    order.status = "confirmed";
    await order.save();

    res.json({
      message: "Payment successful (Dummy)",
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
