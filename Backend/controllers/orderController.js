const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    let orderItems = [];

    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: "Product out of stock" });
      }

      product.stock -= item.quantity;
      await product.save();

      totalAmount += item.price * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });
    }

    const order = await Order.create({
      userId,
      vendorId: orderItems[0].productId.vendorId, // simple demo logic
      items: orderItems,
      totalAmount,
      status: "placed"
    });

    await Cart.deleteOne({ userId });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
