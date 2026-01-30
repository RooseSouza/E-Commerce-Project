const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  placeOrder,
  getVendorOrders
} = require("../controllers/orderController");

// User places order
router.post("/", protect, placeOrder);

// Vendor fetches their orders
router.get("/vendor", protect, getVendorOrders);

module.exports = router;
