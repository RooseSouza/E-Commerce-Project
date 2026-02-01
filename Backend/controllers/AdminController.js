const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

/**
 * 📊 Admin Dashboard Stats
 */
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalVendors = await User.countDocuments({ role: "vendor" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 👥 Get All Vendors
 */
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.aggregate([
      { $match: { role: "vendor" } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "vendorId",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          productCount: 1,
        },
      },
    ]);

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};


/**
 * 📦 Get Products of Specific Vendor
 */
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      vendorId: req.params.vendorId,
    })
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 👤 Get All Users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📦 Get All Products (Admin – no isActive filter)
 */
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .populate("vendorId", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleProductStatusAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 🚫 Cannot enable if stock is zero
    if (product.stock.quantity === 0) {
      return res.status(400).json({
        message: "Cannot enable product with zero stock"
      });
    }

    product.manualDisabled = !product.manualDisabled;
    await product.save(); // auto recalculates isActive

    res.json({
      message: "Product status updated",
      isActive: product.isActive,
      manualDisabled: product.manualDisabled
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * 🗑️ Admin Delete Product
 */
exports.deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
