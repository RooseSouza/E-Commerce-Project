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

    if (!name?.trim()) errors.name = "Name is required";
    if (!/^[0-9]{10}$/.test(phone)) errors.phone = "Phone must be 10 digits";
    if (!houseNumber?.trim()) errors.houseNumber = "House number required";
    if (!street?.trim()) errors.street = "Street required";
    if (!city?.trim()) errors.city = "City required";
    if (!state?.trim()) errors.state = "State required";
    if (!/^[0-9]{6}$/.test(String(zip)))
      errors.zip = "Zip must be 6 digits";
    if (!country?.trim()) errors.country = "Country required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await User.findById(req.user.id);

    user.addresses.push({
      name,
      phone,
      houseNumber,
      street,
      city,
      state,
      zip,
      country,
    });

    await user.save();

    res.json({ addresses: user.addresses });
  } catch (err) {
    console.error(err);
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
