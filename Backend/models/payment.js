const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
