import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setCartItems(data.items || []);
  };

  const updateQuantity = async (productId, quantity) => {
    await fetch(`${import.meta.env.VITE_API_BASE}/api/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    fetchCart();
  };

  const removeFromCart = async (productId) => {
    await fetch(
      `${import.meta.env.VITE_API_BASE}/api/cart/remove/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    fetchCart();
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 499 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Left Side */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="flex gap-4 p-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-32 h-32">
                        <img
                          src={item.productId.image.url}
                          alt={item.productId.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.id}`}
                          className="text-lg font-bold text-gray-900 hover:text-blue-600 mb-2 block"
                        >
                          {item.productId.name}
                        </Link>

                        {/* Price Section */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{item.productId.price}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId._id,
                                  item.quantity - 1,
                                )
                              }
                              className="px-3 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                              −
                            </button>
                            <span className="px-4 py-2 border-l border-r border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId._id,
                                  item.quantity + 1,
                                )
                              }
                              className="px-3 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId._id)}
                            className="text-red-500 hover:text-red-700 font-medium transition ml-auto"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-gray-700">
                            Subtotal:{" "}
                            <span className="font-bold text-gray-900">
                              ₹
                              {(
                                item.productId.price * item.quantity
                              ).toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">
                          FREE
                        </span>
                      ) : (
                        <span>₹{shipping.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (5%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      if (!cartItems || cartItems.length === 0) {
                        alert("Your cart is empty");
                        return;
                      }
                      navigate("/checkout");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3"
                    disabled={!cartItems || cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/home"
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    Continue Shopping
                  </Link>

                  {/* Offers Section */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      ✓ Free delivery on orders above ₹500
                    </p>
                    <p className="text-sm text-blue-800">
                      ✓ Easy returns within 30 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Cart */
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="mb-6 text-6xl">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/home"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Cart;
