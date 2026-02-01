const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  image: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  stock: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ["piece", "kg", "g", "litre", "ml", "pack"],
      required: true
    }
  },

  tags: [
    {
      type: String,
      lowercase: true,
      trim: true
    }
  ],

  isActive: {
    type: Boolean,
    default: true
  },

manualDisabled: {
  type: Boolean,
  default: false
},

approvalStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},


  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.virtual("isActivee").get(function () {
  return (
    this.stock.quantity > 0 &&
    this.approvalStatus === "approved" &&
    !this.manualDisabled
  );
});

// ⚠️ IMPORTANT (so virtual appears in API responses)
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

/* Index for faster search */
productSchema.index({ name: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
