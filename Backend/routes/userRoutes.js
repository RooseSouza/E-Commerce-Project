const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyProfile } = require("../controllers/userController");
const { updateMe } = require("../controllers/userController");

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

router.post("/me/address", protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      houseNumber,
      street,
      city,
      state,
      zip,
      country,
    } = req.body;

    const errors = {};

    if (!name) errors.name = "Name is required";
    if (!/^[0-9]{10}$/.test(phone)) errors.phone = "Phone must be 10 digits";
    if (!houseNumber) errors.houseNumber = "House number required";
    if (!street) errors.street = "Street required";
    if (!city) errors.city = "City required";
    if (!state) errors.state = "State required";
    if (!/^[0-9]{6}$/.test(zip)) errors.zip = "Zip must be 6 digits";
    if (!country) errors.country = "Country required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const user = req.user;

    user.addresses.push({
      name,
      phone,
      houseNumber,
      street,
      city,
      state,
      zip: Number(zip), // ✅ IMPORTANT (schema expects Number)
      country,
    });

    await user.save();

    res.json({ addresses: user.addresses });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({
      errors: { general: "Failed to add address" },
    });
  }
});

// Protected route
router.get("/me", protect, getMe);
router.get("/me/profile", protect, getMyProfile);

router.put("/me", protect, updateMe);


module.exports = router;
