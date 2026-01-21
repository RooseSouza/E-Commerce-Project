const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addProduct,
  getMyProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
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
 * Vendor gets single product
 */
router.get("/:id", protect, authorize("vendor"), getSingleProduct);

/**
 * Vendor updates product
 */
router.put("/:id", protect, authorize("vendor"), updateProduct);

/**
 * Vendor deletes product
 */
router.delete("/:id", protect, authorize("vendor"), deleteProduct);

module.exports = router;
