import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import ItemCard from '../components/itemcard'
import GoanSaleSection from './goanSaleSection'
import LongCardsSection from './LongCardsSection'
import FeaturedBannerSection from '../components/FeaturedBannerSection'
import CTAproducts from './CTAproducts'
import FeaturesSection from '../components/FeaturesSection'
import Footer from '../components/Footer'
const API_BASE = import.meta.env.VITE_API_BASE;

const Home = () => {
  // Featured products data
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the backend
        // Ensure your backend is running on this port and the route is correct (e.g., /api/products)
        const response = await fetch(`${API_BASE}/api/products`)
        const data = await response.json()

        // Map the backend data to the format expected by ItemCard
        const mappedProducts = data.slice(0, 4).map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: Math.round(product.price * 1.2), // Simulating original price as it's not in backend
          image: product.image?.url || 'https://via.placeholder.com/300'
        }))

        setFeaturedProducts(mappedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
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
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ItemCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-12 lg:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Product Grid will be added here */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product cards will go here */}
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
