const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
   getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getTopPicks, 
  getFeaturedProducts, 
  getJustArrivedProducts,
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

/** Get Top Picks Products (Must be before /:id)
 */
router.get("/top-picks", getTopPicks);

/** Get Featured Products (Must be before /:id)
 */
router.get("/featured", getFeaturedProducts);

/** Get Just Arrived Products (Must be before /:id)
 */
router.get("/just-arrived", getJustArrivedProducts);

/**
 * User gets single product details (Public)
 */
router.get("/detail/:id", getSingleProduct);


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
