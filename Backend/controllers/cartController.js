const Cart = require("../models/cart");
const Product = require("../models/product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        totalProducts: 0,
        totalQuantity: 0
      });
    }

    const totalProducts = cart.items.length; // 👈 UNIQUE PRODUCTS

    const totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.json({
      totalProducts,
      totalQuantity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
