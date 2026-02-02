const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  getAdminStats,
  getAllVendors,
  approveVendor,
  rejectVendor,
  blockVendor,
  unblockVendor,
  getVendorProducts,
  getAllUsers,
  getAllProductsAdmin,
  toggleProductStatusAdmin,
  deleteProductAdmin,
  approveRejectProduct,
  getUserOrders,
  getVendorOrders
} = require("../controllers/AdminController");

// 🔐 All routes ADMIN only
router.use(protect, authorize("admin"));

// 📊 Dashboard
router.get("/stats", getAdminStats);

// 👥 Vendors & Users
router.get("/vendors", getAllVendors);
router.get("/vendors/:vendorId/products", getVendorProducts);
router.get("/users", getAllUsers);

// 📦 Products
router.get("/products", getAllProductsAdmin);
router.patch("/products/:id/toggle", toggleProductStatusAdmin);
router.delete("/products/:id", deleteProductAdmin);
router.patch("/products/:id/approve-reject", approveRejectProduct);

// 🏪 Vendor approval / blocking
router.patch("/vendors/:id/approve", approveVendor);
router.patch("/vendors/:id/reject", rejectVendor);
router.patch("/vendors/:id/block", blockVendor);
router.patch("/vendors/:id/unblock", unblockVendor);

// User orders (like vendor products)
router.get("/users/:userId/orders", getUserOrders);

router.get("/vendors/:vendorId/orders", getVendorOrders);
module.exports = router;
