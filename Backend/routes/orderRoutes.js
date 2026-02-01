const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  placeOrder,
  getVendorOrders,
  updateOrderStatus

} = require("../controllers/orderController");
console.log({
  placeOrder: typeof placeOrder,
  getVendorOrders: typeof getVendorOrders,
  updateOrderStatus: typeof updateOrderStatus,
});

// User places order
router.post("/", protect, placeOrder);

// Vendor fetches their orders
router.get("/vendor", protect, getVendorOrders);

router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;
