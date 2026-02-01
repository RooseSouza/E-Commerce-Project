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

exports.toggleProductStatusAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("vendorId");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // ❌ Stock zero → always disabled
    if (product.stock.quantity === 0) {
      product.isActive = false;
      await product.save();
      return res.status(400).json({ message: "Stock is zero. Product disabled." });
    }

    // ❌ Vendor not approved or blocked
    if (!product.vendorId.isApproved || product.vendorId.isBlocked) {
      product.isActive = false;
      await product.save();
      return res
        .status(400)
        .json({ message: "Vendor not approved or blocked" });
    }

    // ✅ ADMIN MANUAL TOGGLE
    product.isActive = !product.isActive;
    await product.save();

    res.json({
      message: "Product status updated",
      isActive: product.isActive,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// ✅ APPROVE VENDOR
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ message: "Vendor approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
};

// ❌➡️✅ REJECT VENDOR (FIXED)
exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ message: "Vendor rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rejection failed" });
  }
};

/**
 * 🚫 Block Vendor
 */
exports.blockVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isBlocked = true;
    await vendor.save();

    // 🔴 AUTO-DISABLE ALL PRODUCTS OF THIS VENDOR
    await Product.updateMany(
      { vendorId: vendor._id },
      { isActive: false }
    );

    res.json({
      message: "Vendor blocked and all products disabled",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to block vendor" });
  }
};


/**
 * 🔓 Unblock Vendor
 */
exports.unblockVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isBlocked = false;
    await vendor.save();

    if (vendor.isApproved) {
      await Product.updateMany(
        { vendorId: vendor._id, approvalStatus: "approved" },
        { isActive: true }
      );
    }

    res.json({
      message: "Vendor unblocked and approved products enabled",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unblock vendor" });
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

 } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//user contol admin

exports.blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBlocked = true;
  await user.save();
  res.json(user);
};

exports.unblockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBlocked = false;
  await user.save();
  res.json(user);
};


