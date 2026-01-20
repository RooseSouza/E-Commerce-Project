const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { makePayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/pay", protect, makePayment);

module.exports = router;
