const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  getCartSummary,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeFromCart);
router.get("/summary", protect, getCartSummary);

module.exports = router;
