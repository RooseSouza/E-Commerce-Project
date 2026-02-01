const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // Assuming you have this
const { getNotifications, markAsRead } = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);

module.exports = router;