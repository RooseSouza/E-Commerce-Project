const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const adminCtrl = require("../controllers/AdminController"); // ✅ FIXED PATH

// All routes are ADMIN only
router.use(protect, authorize("admin"));

// Dashboard stats
router.get("/stats", adminCtrl.getAdminStats);

// Vendors & Users
router.get("/vendors", adminCtrl.getAllVendors);
router.get("/vendors/:vendorId/products", adminCtrl.getVendorProducts);
router.get("/users", adminCtrl.getAllUsers);

// Products management
router.get("/products", adminCtrl.getAllProductsAdmin);
router.patch("/products/:id/toggle", adminCtrl.toggleProductStatusAdmin);

router.delete(
  "/products/:id",
  adminCtrl.deleteProductAdmin
);
module.exports = router;
