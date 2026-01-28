import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ItemCard from '../components/itemcard'

const ProductDetails = () => {
  const { productId } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Sample product data
  const product = {
    id: productId || 1,
    name: 'The Unknown Product',
    variant: '(Color) (Required Details)',
    price: 34999,
    originalPrice: 50000,
    discount: '30%',
    rating: 4.5,
    reviewCount: 45666,
    mainImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1590080876-e7de9e7cc9a5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595521624623-456be06cc8e0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop'
    ],
    deliveryDate: 'XY Jan, Randomonday',
    offers: [
      'This is a 5% offer on all sale on selected product',
      'This is a 5% offer on all sale on selected product',
      'This is a 5% offer on all sale on selected product',
      'This is a 5% offer on all sale on selected product',
      'This is a 5% offer on all sale on selected product'
    ],
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    inStock: true
  }

  const relatedProducts = [
    {
      id: 2,
      name: 'Similar Product A',
      price: 1599,
      originalPrice: 3199,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Similar Product B',
      price: 1299,
      originalPrice: 2599,
      image: 'https://images.unsplash.com/photo-1595521624623-456be06cc8e0?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Similar Product C',
      price: 1799,
      originalPrice: 3599,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Similar Product D',
      price: 1499,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1590080876-e7de9e7cc9a5?w=300&h=300&fit=crop'
    }
  ]

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of product ${product.id} to cart`)
  }

  const handleBuyNow = () => {
    console.log(`Buying ${quantity} of product ${product.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <span>Home / Products / </span>
            <span className="font-semibold text-gray-900">{product.name}</span>
          </div>

          {/* Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Left - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 md:h-[500px] object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {product.variant}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-lg">★★★★☆</span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">
                    {product.rating}
                  </span>
                  <span className="text-gray-600">
                    {product.reviewCount.toLocaleString()} reviews
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xl line-through text-gray-500">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded font-bold text-lg">
                    {product.discount} OFF
                  </span>
                </div>
                <p className="text-green-600 font-semibold">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </p>
              </div>

              {/* Delivery */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-700">
                  <span className="font-semibold">Secure Delivery expected by</span> {product.deliveryDate}
                </p>
              </div>

              {/* Offers */}
              <div className="bg-white p-4 rounded-lg border border-gray-300">
                <h3 className="font-bold text-gray-900 mb-3">Back and other offers</h3>
                <ul className="space-y-2">
                  {product.offers.slice(0, 3).map((offer, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{offer}</span>
                      <span className="text-xs text-gray-500 ml-auto">TNC</span>
                    </li>
                  ))}
                </ul>
                <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-3">
                  View {product.offers.length - 3} more offers
                </button>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>🛒</span>
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Stock Status */}
              {product.inStock ? (
                <p className="text-green-600 font-semibold">✓ In Stock</p>
              ) : (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Related Products */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ItemCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ProductDetails
