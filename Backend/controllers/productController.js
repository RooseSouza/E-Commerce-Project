const Product = require("../models/product");
const Category = require("../models/category");

/**
 * Vendor adds a new product
 */
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, categoryName, image, stock } = req.body;

    // Check required fields
    if (!name || !description || !price || !categoryName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Find category by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    // Create product
    const product = new Product({
      name,
      description,
      price,
      categoryId: category._id,
      image,
      stock,
      vendorId: req.user._id
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate("categoryId", "name");

    res.status(200).json({
      message: "Product added successfully",
      product: populatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Vendor gets ALL his products
 */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id })
      .populate("categoryId", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Get ALL products (Public)
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Vendor gets SINGLE product
 */
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id
    }).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found or access denied"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Vendor updates SINGLE product
 */
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(403).json({
        message: "You can update only your own product"
      });
    }

    res.json({
      message: "Product updated successfully",
      updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Vendor deletes SINGLE product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.user._id
    });

    if (!deletedProduct) {
      return res.status(403).json({
        message: "You can delete only your own product"
      });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
