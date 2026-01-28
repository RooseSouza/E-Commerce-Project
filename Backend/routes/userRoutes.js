const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
} = require("../controllers/userController");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin); // Google login route

// Protected route
router.get("/me", protect, getMe);

module.exports = router;
