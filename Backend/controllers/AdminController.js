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
          isApproved: 1,   // ✅ REQUIRED
          isBlocked: 1,    // ✅ REQUIRED
          createdAt: 1
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
  const product = await Product.findById(req.params.id).populate("vendorId");

  if (!product) return res.status(404).json({ message: "Not found" });

  if (product.stock.quantity === 0) {
    return res.status(400).json({ message: "Stock is zero" });
  }

  if (!product.vendorId.isApproved || product.vendorId.isBlocked) {
    return res.status(400).json({ message: "Vendor not approved or blocked" });
  }

  product.manualDisabled = !product.manualDisabled;
  await product.save();

  res.json({
    isActive: product.isActive,
    manualDisabled: product.manualDisabled
  });
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

exports.approveVendor = async (req, res) => {
  const vendor = await User.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.isApproved = true;
  vendor.isBlocked = false;

  await vendor.save();
  res.json(vendor);
};


exports.rejectVendor = async (req, res) => {
  const vendor = await User.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.isApproved = null;
  vendor.isBlocked = false;

  await vendor.save();
  res.json(vendor);
};



exports.blockVendor = async (req, res) => {
  const vendor = await User.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.isBlocked = true;
  vendor.isApproved = false;

  await vendor.save();
  res.json(vendor);
};


exports.unblockVendor = async (req, res) => {
  const vendor = await User.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.isBlocked = false;
  vendor.isApproved = false; // ⚠️ stays pending

  await vendor.save();
  res.json(vendor);
};


exports.approveRejectProduct = async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.approvalStatus = status;

    // auto-disable if rejected
    if (status === "rejected") {
      product.manualDisabled = true;
    }

    await product.save();

    res.json({
      message: `Product ${status}`,
      approvalStatus: product.approvalStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
