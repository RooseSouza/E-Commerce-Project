const mongoose = require("mongoose");

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
    "Please enter a valid email"
    ]
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // required ONLY for normal login
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
      return !this.googleId; // required ONLY for normal login
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  googleId: {
    type: String,
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
});

module.exports = mongoose.model("User", userSchema);
