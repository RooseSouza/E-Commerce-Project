const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,

  houseNumber: {
    type: String,
    required: true,
  },

  street: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  zip: {
    type: Number,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
  },

  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },

  role: {
    type: String,
    enum: ["user", "vendor", "admin"],
    default: "user",
  },

  phone: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },

  addresses: [addressSchema], // ✅ ADDRESSES STORED HERE

  createdAt: {
    type: Date,
    default: Date.now,
  },

  googleId: String,

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
});

module.exports = mongoose.model("User", userSchema);
