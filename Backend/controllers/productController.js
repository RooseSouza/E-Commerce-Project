const Product = require("../models/product");
const Category = require("../models/category");
const cloudinary = require("../config/cloudinary");

// Vendor adds product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryName,
      stockQuantity,
      stockUnit,
      tags,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !categoryName ||
      stockQuantity === undefined ||
      !stockUnit
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
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
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
      vendorId: req.user._id,
      stock: {
        quantity: stockQuantity,
        unit: stockUnit,
      },
      tags: Array.isArray(tags) ? tags.map((tag) => tag.toLowerCase()) : [],
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vendor gets own products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id }).populate(
      "categoryId",
      "name",
    );

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

//User searches for product
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } }
      ]
    })
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
      vendorId: req.user._id,
    }).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found or access denied",
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
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id,
    });

    if (!product) {
      return res.status(403).json({
        message: "You can update only your own product",
      });
    }

    /* ---------- BASIC FIELDS ---------- */
    if (req.body?.name !== undefined) {
      product.name = req.body.name;
    }

    if (req.body?.description !== undefined) {
      product.description = req.body.description;
    }

    if (req.body?.price !== undefined && req.body.price !== "") {
      product.price = Number(req.body.price);
    }

    /* ---------- STOCK SAFETY ---------- */
    if (!product.stock) {
      product.stock = { quantity: 0, unit: "pcs" };
    }

    if (req.body?.stockQuantity !== undefined && req.body.stockQuantity !== "") {
      const qty = Number(req.body.stockQuantity);

      if (!isNaN(qty)) {
        product.stock.quantity = qty;
        product.isActive = qty > 0;
      }
    }

    if (req.body?.stockUnit) {
      product.stock.unit = req.body.stockUnit;
    }

    /* ---------- TAGS (string or array safe) ---------- */
    if (req.body?.tags) {
      if (Array.isArray(req.body.tags)) {
        product.tags = req.body.tags.map(tag =>
          tag.trim().toLowerCase()
        );
      } else {
        product.tags = req.body.tags
          .split(",")
          .map(tag => tag.trim().toLowerCase());
      }
    }

    /* ---------- IMAGE ---------- */
    if (req.file) {
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Server error while updating product",
      error: error.message,
    });
  }
};

// maunal disable or enable product
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      message: `Product ${product.isActive ? "activated" : "disabled"} successfully`,
      isActive: product.isActive
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
      vendorId: req.user._id,
    });

    if (!deletedProduct) {
      return res.status(403).json({
        message: "You can delete only your own product",
      });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
