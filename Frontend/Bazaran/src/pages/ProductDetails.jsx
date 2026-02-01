import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'


import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ItemCard from '../components/itemcard'

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const ProductDetails = () => {
  const navigate = useNavigate()
  const params = useParams()
  // Handle both 'productId' and 'id' parameter names to be safe with router config
  const productId = params.productId || params.id
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [productState, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE}/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error(`Product not found (Status: ${response.status})`)
        }

        const result = await response.json()
        // Handle if backend returns { product: {...} } or just {...}
        const data = result.product || result

        if (!data || (!data.name && !data._id && !data.id)) {
          throw new Error('Invalid product data received')
        }

        // Normalize images
        let images = []
        if (data?.images && data.images.length > 0) {
          images = data.images.map((img) => (typeof img === 'string' ? img : img.url))
        } else {
          // Fallback to single image logic from goanSaleSection
          // Handles: object with url, string url, or missing
          const mainImage = data?.image?.url || data?.image || 'https://via.placeholder.com/300'
          images = [mainImage]
        }

        // Handle category safely (Backend uses categoryId)
        let variant = 'Standard'
        if (data?.categoryId) {
          variant = typeof data.categoryId === 'object' ? data.categoryId.name : data.categoryId
        } else if (data?.category) {
          variant = typeof data.category === 'object' ? data.category.name : data.category
        }

        setProduct({
          id: data._id || data.id,
          name: data.name,
          // Handle category safely whether it's populated or just an ID
          variant: variant || 'Standard',
          price: data.price || 0,
          originalPrice: data.originalPrice || Math.round((data.price || 0) * 1.2),
          discount: data.discount || '30%',
          rating: data.rating || 4.5,
          reviewCount: data.numReviews || 0,
          images: images,
          deliveryDate: '3-5 Business Days',
          offers: [
            'Bank Offer 5% Unlimited Cashback on Axis Bank Credit Card',
            'Special Price Get extra 20% off (price inclusive of discount)',
            'Partner Offer Sign up for Flipkart Pay Later and get Flipkart Gift Card worth ₹100'
          ],
          description: data.description || 'No description available.',
          inStock: (data?.stock?.quantity ?? data?.countInStock ?? 0) > 0
        })
        setSelectedImage(0)
      } catch (err) {
        console.error("Error in ProductDetails:", err)
        if (err.message === 'Failed to fetch') {
          setError(`Network error: Verify backend is running on port 5000 and allows CORS.`)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Fallback data if fetch fails so page still renders
  const product = productState || {
    id: '0',
    name: 'Product Details Unavailable',
    variant: '',
    price: 0,
    originalPrice: 0,
    discount: '0%',
    rating: 0,
    reviewCount: 0,
    images: ['https://via.placeholder.com/500?text=No+Image'],
    deliveryDate: 'N/A',
    offers: [],
    description: 'We could not load the product details at this time.',
    inStock: false
  }

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products?limit=20`)
        const data = await response.json()

        if (Array.isArray(data)) {
          // Filter out current product
          const filtered = data.filter((p) => p._id !== productId && p.id !== productId)
          // Shuffle array to get random products
          const shuffled = filtered.sort(() => 0.5 - Math.random())
          // Take first 4
          const selected = shuffled.slice(0, 4)

          const mapped = selected.map((p) => ({
            id: p._id,
            _id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.2),
            image: p.image?.url || p.image || 'https://via.placeholder.com/300'
          }))
          setRelatedProducts(mapped)
        }
      } catch (error) {
        console.error('Error fetching related products:', error)
      }
    }

    fetchRelatedProducts()
  }, [productId])

  const handleAddToCart = async () => {
    if (!product.inStock) {
      alert("This product is out of stock");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: quantity }),
      });

      const data = await response.json();
      alert(response.ok ? "Item added to cart!" : data.message || "Failed to add to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to purchase");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: quantity }),
      });

      if (response.ok) {
        navigate("/checkout");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Error in Buy Now:", error);
      alert("Something went wrong. Please try again.");
    }
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
                  disabled={!product.inStock}
                  className={`flex-1 ${!product.inStock ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"} text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
                >
                  <span>🛒</span>
                  {product.inStock ? "Add to cart" : "Out of Stock"}
                </button>
                
                  Add to cart
                </button>
              </div>

              {/* Stock Status */}
              {product.inStock ? (
                <p className="text-green-600 font-semibold">✓ In Stock</p>
              ) : (
                <p className="text-red-600 font-semibold">X Out of Stock</p>
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
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <ItemCard product={relatedProduct} />
                </Link>
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
