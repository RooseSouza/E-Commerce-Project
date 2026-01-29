const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: Number,
    country: String,
  },
  { _id: true }
);

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
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email",
    ],
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

  addresses: [addressSchema], // ✅ NEW

  googleId: String,

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
