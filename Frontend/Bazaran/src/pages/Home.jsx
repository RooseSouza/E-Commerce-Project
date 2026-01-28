import React from 'react'
import Header from '../components/Header'
import ItemCard from '../components/itemcard'
import GoanSaleSection from './goanSaleSection'
import LongCardsSection from './LongCardsSection'
import FeaturedBannerSection from '../components/FeaturedBannerSection'
import CTAproducts from './CTAproducts'
import FeaturesSection from '../components/FeaturesSection'
import Footer from '../components/Footer'

const Home = () => {
  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Wooden artwork',
      price: 2499,
      originalPrice: 4999,
      image: 'https://plus.unsplash.com/premium_photo-1677785617433-031ab653c59c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGluZGlhbiUyMHdvb2RlbiUyMGl0ZW1zfGVufDB8fDB8fHww'
    },
    {
      id: 2,
      name: 'Decorative earings',
      price: 1599,
      originalPrice: 3199,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Decorative Lantern',
      price: 899,
      originalPrice: 1799,
      image: 'https://images.unsplash.com/photo-1666594948915-3b8d490ff9eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwbGFudGVybnxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: 4,
      name: 'Sanguem bashi',
      price: 1299,
      originalPrice: 2599,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=300&fit=crop'
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
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
