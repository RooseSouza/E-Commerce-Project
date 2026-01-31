const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const cloudinary = require("../config/cloudinary");

/* ================= ADD PRODUCT ================= */
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
      isTopPick,
      isFeatured,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    if (
      !name ||
      !description ||
      !price ||
      !categoryName ||
      stockQuantity === undefined ||
      !stockUnit
    ) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    let processedTags = [];
    if (tags) {
      processedTags = Array.isArray(tags)
        ? tags.map((t) => t.toLowerCase())
        : tags.split(",").map((t) => t.trim().toLowerCase());
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
      tags: processedTags,
      isTopPick: isTopPick === true || isTopPick === "true",
      isFeatured: isFeatured === true || isFeatured === "true",
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET MY PRODUCTS ================= */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id })
      .populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET ALL PRODUCTS ================= */
exports.getAllProducts = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { isActive: true };
    const { isTopPick, isFeatured, isJustArrived, limit, categoryId, category } =
      req.query;

    const isTrue = (val) =>
      typeof val === "string" ? val.toLowerCase() === "true" : val === true;

    if (isTrue(isTopPick)) filter.isTopPick = true;
    if (isTrue(isFeatured)) filter.isFeatured = true;

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    } else if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${category}$`, "i") },
      });
      if (!categoryDoc) return res.json([]);
      filter.categoryId = categoryDoc._id;
    }

    let query = Product.find(filter)
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    if (isTrue(isJustArrived)) {
      query = query.sort({ createdAt: -1 });
    }

    if (limit) query = query.limit(Number(limit));

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= SEARCH ================= */
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET PRODUCT (VENDOR) ================= */
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id,
    }).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found or denied" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET PRODUCT (PUBLIC) ================= */
exports.getPublicProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE PRODUCT ================= */
exports.updateProduct = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid product ID" });
    }

    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;

    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (!isNaN(price)) updateData.price = price;
    }

    if (req.body.categoryName) {
      const category = await Category.findOne({ name: req.body.categoryName });
      if (!category) {
        return res.status(400).json({ message: "Invalid category" });
      }
      updateData.categoryId = category._id;
    }

    if (req.body.stockQuantity !== undefined && req.body.stockQuantity !== "") {
      const qty = Number(req.body.stockQuantity);
      if (!isNaN(qty)) {
        updateData["stock.quantity"] = qty;
        updateData.isActive = qty > 0;
      }
    }

    if (req.body.stockUnit) updateData["stock.unit"] = req.body.stockUnit;

    if (req.file) {
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct?.image?.public_id) {
        await cloudinary.uploader.destroy(oldProduct.image.public_id);
      }
      updateData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Unauthorized or not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= TOGGLE PRODUCT ================= */
exports.toggleProductStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id,
    });

    if (!product) return res.status(404).json({ message: "Not found" });

    product.isActive =
      product.stock?.quantity === 0 ? false : !product.isActive;

    await product.save();

    res.json({
      message: `Product ${product.isActive ? "activated" : "disabled"}`,
      isActive: product.isActive,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= SPECIAL LISTS ================= */
exports.getTopPicks = async (req, res) => {
  const products = await Product.find({ isTopPick: true, isActive: true })
    .limit(4)
    .populate("categoryId", "name")
    .populate("vendorId", "name");
  res.json(products);
};

exports.getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("categoryId", "name")
    .populate("vendorId", "name");
  res.json(products);
};

exports.getJustArrivedProducts = async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("categoryId", "name")
    .populate("vendorId", "name");
  res.json(products);
};

/* ================= DELETE ================= */
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.user._id,
    });

    if (!deletedProduct) {
      return res.status(403).json({ message: "Unauthorized delete" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
