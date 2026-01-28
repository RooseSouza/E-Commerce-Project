const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addToCart } = require("../controllers/cartController");

const router = express.Router();

// ONLY logged-in users can add to cart
router.post("/add", protect, addToCart);

module.exports = router;
