const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");

// Place order and split by vendor
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔁 Check for duplicate address
    let savedAddress = user.addresses.find(
      (addr) =>
        addr.street === address.street &&
        addr.city === address.city &&
        addr.zip === address.zip &&
        addr.phone === address.phone
    );

    // ➕ Add new address if not found
    if (!savedAddress) {
      user.addresses.push(address);
      await user.save();
      savedAddress = user.addresses[user.addresses.length - 1];
    }

    const addressId = savedAddress._id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 🧩 Group items by vendor
    const vendorMap = {};
    cart.items.forEach((item) => {
      const vendorId = item.productId.vendorId.toString();
      if (!vendorMap[vendorId]) vendorMap[vendorId] = [];
      vendorMap[vendorId].push(item);
    });

    const createdOrders = [];

    for (const vendorId in vendorMap) {
      const items = vendorMap[vendorId];
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId._id);
        if (!product || product.stock.quantity < item.quantity) {
          return res.status(400).json({
            message: `Product ${product?.name || ""} is out of stock`,
          });
        }

        product.stock.quantity -= item.quantity;
        await product.save();

        subtotal += item.quantity * item.price;
        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: item.price,
        });
      }

      const tax = Math.round(subtotal * 0.05);
      const deliveryCharge = subtotal >= 499 ? 0 : 40;
      const totalAmount = subtotal + tax + deliveryCharge;

      const order = await Order.create({
        userId,
        vendorId,
        items: orderItems,
        totalAmount,
        addressId,
        status: "placed",
      });

      createdOrders.push(order);
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Orders placed successfully",
      orders: createdOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
