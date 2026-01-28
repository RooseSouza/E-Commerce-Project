import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Wooden artwork',
      price: 2499,
      originalPrice: 4999,
      quantity: 1,
      image: 'https://plus.unsplash.com/premium_photo-1677785617433-031ab653c59c?w=300&h=300&fit=crop',
      discount: '50%'
    },
    {
      id: 2,
      name: 'Decorative Lantern',
      price: 899,
      originalPrice: 1799,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1666594948915-3b8d490ff9eb?w=300&h=300&fit=crop',
      discount: '50%'
    }
  ])

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 50
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

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
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Left Side */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex gap-4 p-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-32 h-32">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.id}`}
                          className="text-lg font-bold text-gray-900 hover:text-blue-600 mb-2 block"
                        >
                          {item.name}
                        </Link>

                        {/* Price Section */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{item.price}
                          </span>
                          <span className="text-lg line-through text-gray-500">
                            ₹{item.originalPrice}
                          </span>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                            {item.discount} OFF
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                              −
                            </button>
                            <span className="px-4 py-2 border-l border-r border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 font-medium transition ml-auto"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-gray-700">
                            Subtotal: <span className="font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
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
                      <span className="text-green-600 font-semibold">FREE</span>
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
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3">
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/products"
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    Continue Shopping
                  </Link>

                  {/* Offers Section */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      ✓ Free delivery on orders above ₹500
                    </p>
                    <p className="text-sm text-blue-800 mb-2">
                      ✓ 5% discount on your first purchase
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
              <div className="mb-6 text-6xl">
                🛒
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/products"
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
  )
}

export default Cart
