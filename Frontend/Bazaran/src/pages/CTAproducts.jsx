import React , { useState, useEffect } from 'react'
import ItemCard from '../components/itemcard'
import CTA from '../components/CTA'

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const CTAproducts = () => {
  // Featured products data
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [justArrivedProducts, setJustArrivedProducts] = useState([])

  useEffect(() => {
    // Helper to map backend data to frontend format
    const mapProductData = (product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || Math.round(product.price * 1.2),
      image: product.image?.url || product.image || 'https://via.placeholder.com/300'
    })

    const fetchData = async () => {
      try {
        // Fetch Featured Products
        const featuredRes = await fetch(`${API_BASE}/api/products?isFeatured='true'&limit=5`)
        const featuredData = await featuredRes.json()
        
        if (Array.isArray(featuredData)) {
          setFeaturedProducts(featuredData.map(mapProductData))
        }

        // Fetch Just Arrived (Newest products)
        const arrivedRes = await fetch(`${API_BASE}/api/products?isJustArrived=true&limit=10`)
        const arrivedData = await arrivedRes.json()
        
        if (Array.isArray(arrivedData)) {
          setJustArrivedProducts(arrivedData.map(mapProductData))
        }

      } catch (error) {
        console.error('Error fetching CTA products:', error)
      }
    }
  

    fetchData()
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Featured Products Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Featured product
            </h2>
          </div>

          {/* Products Grid - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max lg:min-w-full lg:grid lg:grid-cols-5">
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-48 lg:w-auto flex-shrink-0 lg:flex-shrink">
                  <ItemCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-8">
        <CTA />
      </section>

      {/* Just Arrived Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Just arrived
            </h2>
          </div>

          {/* Products Grid - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max lg:min-w-full lg:grid lg:grid-cols-5">
              {justArrivedProducts.map((product) => (
                <div key={product.id} className="w-48 lg:w-auto flex-shrink-0 lg:flex-shrink">
                  <ItemCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CTAproducts
