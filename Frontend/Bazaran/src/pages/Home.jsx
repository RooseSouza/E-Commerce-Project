import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import ItemCard from '../components/itemcard'
import GoanSaleSection from './goanSaleSection'
import LongCardsSection from './LongCardsSection'
import FeaturedBannerSection from '../components/FeaturedBannerSection'
import CTAproducts from './CTAproducts'
import FeaturesSection from '../components/FeaturesSection'
import Footer from '../components/Footer'

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Helper to map backend data
        const mapProduct = (product) => ({
          id: product._id,
          _id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || Math.round(product.price * 1.2),
          image: product.image?.url || product.image || 'https://via.placeholder.com/300'
        })

        // Fetch Featured Products (Limit 5)
        const featRes = await fetch(`${API_BASE}/api/products?isFeatured=true&limit=5`)
        const featData = await featRes.json()
        
        if (Array.isArray(featData)) {
          setFeaturedProducts(featData.map(mapProduct))
        }

        // Fetch Best Sellers (Using Top Picks as proxy, Limit 4)
        const bestRes = await fetch(`${API_BASE}/api/products?isTopPick=true&limit=4`)
        const bestData = await bestRes.json()
        
        if (Array.isArray(bestData)) {
          setBestSellers(bestData.map(mapProduct))
        }

      } catch (error) {
        console.error('Error fetching home products:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section - Navbar + Carousel */}
      <section className="w-full">
        <Header />
      </section>

      {/* Main Content Sections will be added here */}

      {/* Featured Products Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredProducts.slice(0, 5).map((product) => (
              <ItemCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    
      {/* Goan Sale Section */}
      <section className="w-full">
        <GoanSaleSection />
      </section>

      {/* Long Cards Section */}
      <section className="w-full">
        <LongCardsSection />
      </section>

      {/* Featured Banner Section */}
      <section className="w-full">
        <FeaturedBannerSection />
      </section>

      {/* CTA Products Section */}
      <section className="w-full">
        <CTAproducts />
      </section>

      {/* Features Section */}
      <section className="w-full">
        <FeaturesSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
