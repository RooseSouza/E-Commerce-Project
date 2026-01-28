const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  toggleProductStatus
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");

/**
 * Vendor adds product
 */
router.post("/", protect, authorize("vendor"), upload.single("image"),addProduct);

/**
 * Vendor gets his products
 */
router.get("/my-products", protect, authorize("vendor"), getMyProducts);

/**
 * Get all products (Public)
 */
router.get("/", getAllProducts);

/**
 * User searches for a product
 */
router.get("/search", searchProducts);


/**
 * Vendor gets single product
 */
router.get("/:id", protect, authorize("vendor"), getProductById);

/**
 * Vendor updates product
 */
router.put("/:id", protect, authorize("vendor"), updateProduct);

// Vendor enable / disable product
router.put("/:id/toggle-status", protect, authorize("vendor"), toggleProductStatus);

/**
 * Vendor deletes product
 */
router.delete("/:id", protect, authorize("vendor"), deleteProduct);

module.exports = router;
