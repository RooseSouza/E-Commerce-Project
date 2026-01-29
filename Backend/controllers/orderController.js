const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");

// Place order and split by vendor
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    if (!address || !address.houseNumber) {
      return res.status(400).json({ message: "Complete address is required" });
    }

    const user = await User.findById(userId);

    // 🔍 Check if same address already exists
    let existingAddress = user.addresses.find(
      (a) =>
        a.houseNumber === address.houseNumber &&
        a.street === address.street &&
        a.city === address.city &&
        a.zip === address.zip
    );

    if (!existingAddress) {
      user.addresses.push(address);
      await user.save();
      existingAddress = user.addresses[user.addresses.length - 1];
    }

    const addressId = existingAddress._id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const vendorMap = {};
    cart.items.forEach(item => {
      const vendorId = item.productId.vendorId.toString();
      if (!vendorMap[vendorId]) vendorMap[vendorId] = [];
      vendorMap[vendorId].push(item);
    });

    const createdOrders = [];

    for (const vendorId in vendorMap) {
      let subtotal = 0;
      const orderItems = [];

      for (const item of vendorMap[vendorId]) {
        const product = await Product.findById(item.productId._id);

        if (product.stock.quantity < item.quantity) {
          return res.status(400).json({ message: "Out of stock" });
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
        addressId, // ✅ ONLY ID STORED
        status: "placed",
      });

      createdOrders.push(order);
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", orders: createdOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
