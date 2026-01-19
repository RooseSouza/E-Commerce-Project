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
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "vendor", "admin"],
    default: "user",
  },
  phone: String,
  address: String,
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
