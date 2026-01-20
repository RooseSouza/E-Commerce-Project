const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const { protect, authorize } = require("../middleware/authMiddleware");


/**
 * @route   POST /api/products
 * @desc    Vendor adds a new product (selects category by name)
 * @access  Vendor
 */
router.post("/", protect, authorize("vendor"), async (req, res) => {
  try {
    const { name, description, price, categoryName, image, stock } = req.body;

    // Check required fields
    if (!name || !description || !price || !categoryName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Find category by name
     const category = await Category.findOne({ name: categoryName });
    if (!Category) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    // Create new product with categoryId
    const product = new Product({
      name,
      description,
      price,
      categoryId: category._id, // Save ID internally
      image,
      stock,
      vendorId: req.user._id
    });

    await product.save();

    // Populate category name before sending response
    const populatedProduct = await Product.findById(product._id).populate("categoryId", "name");

    res.status(201).json({ message: "Product added successfully", product: populatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
/**
 * @route   GET /api/products/my-products
 * @desc    Vendor gets ALL his products
 * @access  Vendor
 */
router.get("/my-products", protect, authorize("vendor"), async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id }).populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Vendor gets SINGLE product (only his)
 * @access  Vendor
 */
router.get("/:id", protect, authorize("vendor"), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, vendorId: req.user._id }).populate("categoryId", "name");

    if (!product) return res.status(404).json({ message: "Product not found or access denied" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Vendor updates SINGLE product
 * @access  Vendor
 */
router.put("/:id", protect, authorize("vendor"), async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedProduct) return res.status(403).json({ message: "You can update only your own product" });

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Vendor deletes SINGLE product
 * @access  Vendor
 */
router.delete("/:id", protect, authorize("vendor"), async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user._id });

    if (!deletedProduct) return res.status(403).json({ message: "You can delete only your own product" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
