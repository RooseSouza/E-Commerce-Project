const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  getMyProfile,
  updateMe,
  addAddress, // ✅ IMPORT
} = require("../controllers/userController");

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

// Profile
router.get("/me", protect, getMe);
router.get("/me/profile", protect, getMyProfile);
router.put("/me", protect, updateMe);

// Address
router.post("/me/address", protect, addAddress); // ✅ CLEAN

router.delete("/me/address/:addressId", protect, userController.deleteAddress);

module.exports = router;
