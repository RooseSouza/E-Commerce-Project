const Product = require("../models/product");
const Category = require("../models/category");

// Vendor adds product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryName,
      image,
      stockQuantity,
      stockUnit
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !categoryName ||
      stockQuantity === undefined ||
      !stockUnit
    ) {
      return res.status(400).json({
        message: "All fields including stock quantity and unit are required"
      });
    }

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId: category._id,
      image,
      vendorId: req.user._id,
      stock: {
        quantity: stockQuantity,
        unit: stockUnit
      }
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    res.status(201).json({
      message: "Product added successfully",
      product: populatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vendor gets own products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id })
      .populate("categoryId", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User gets all products
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

// Vendor gets single product
exports.getProductById = async (req, res) => {
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

// Vendor updates product
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

// Vendor deletes product
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
