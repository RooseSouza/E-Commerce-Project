const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["placed", "confirmed", "dispatched", "delivered", "cancelled"],
    default: "placed"
  },

  address: {
    name: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    street: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    zip: {
      type: Number,
      required: false
    },
    country: {
      type: String,
      required: false
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
