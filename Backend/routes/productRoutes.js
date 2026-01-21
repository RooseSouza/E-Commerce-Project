const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  addProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.post("/", protect, authorize("vendor"), addProduct);
router.get("/my-products", protect, authorize("vendor"), getMyProducts);
router.get("/", getAllProducts);
router.get("/:id", protect, authorize("vendor"), getProductById);
router.put("/:id", protect, authorize("vendor"), updateProduct);
router.delete("/:id", protect, authorize("vendor"), deleteProduct);

module.exports = router;
