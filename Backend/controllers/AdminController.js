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
          isApproved: 1,
          isBlocked: 1,
          createdAt: 1,
        },
      },
    ]);

    res.json(vendors);
  } catch (err) {
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
 * 🧾 Get Orders of Specific Vendor (NEW)
 */
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    // 1️⃣ Get vendor product IDs
    const products = await Product.find(
      { vendorId },
      "_id name"
    );

    const productIds = products.map(p => p._id);

    // 2️⃣ Find orders containing those products
    const orders = await Order.find({
      "items.productId": { $in: productIds },
    })
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json({
      vendorId,
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 👤 Get All Users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📦 Get All Products (Admin)
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

/**
 * 🔁 Toggle Product Active Status
 */
exports.toggleProductStatusAdmin = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("vendorId");

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.stock.quantity === 0) {
    return res.status(400).json({ message: "Stock is zero" });
  }

  if (!product.vendorId.isApproved || product.vendorId.isBlocked) {
    return res
      .status(400)
      .json({ message: "Vendor not approved or blocked" });
  }

  product.manualDisabled = !product.manualDisabled;
  await product.save();

  res.json({
    isActive: product.isActive,
    manualDisabled: product.manualDisabled,
  });
};

/**
 * 🗑️ Delete Product (Admin)
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

/**
 * ✅ Approve Vendor
 */
exports.approveVendor = async (req, res) => {
  const vendor = await User.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.isApproved = true;
  vendor.isBlocked = false;

  await vendor.save();
  res.json(vendor);
};

/**
 * ❌ Reject Vendor
 */
exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isBlocked: false },
      { new: true }
    ).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🚫 Block Vendor
 */
exports.blockVendor = async (req, res) => {
  const vendor = await User.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.isBlocked = true;
  vendor.isApproved = false;

  await vendor.save();
  res.json(vendor);
};

/**
 * 🔓 Unblock Vendor
 */
exports.unblockVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ / ❌ Approve or Reject Product
 */
exports.approveRejectProduct = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.approvalStatus = status;

    if (status === "rejected") {
      product.manualDisabled = true;
    }

    await product.save();

    res.json({
      message: `Product ${status}`,
      approvalStatus: product.approvalStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 👤 Get Orders of Specific User
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);

};
