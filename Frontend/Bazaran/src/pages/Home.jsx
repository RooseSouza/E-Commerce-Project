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
      name: 'Traditional Goan Bebinca',
      price: 450,
      originalPrice: 600,
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      name: 'Handmade Crochet Top',
      price: 1200,
      originalPrice: 1800,
      image: 'https://images.unsplash.com/photo-1619250907248-1bfef461c31b?w=600&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      name: 'Pure Kokum Extract',
      price: 350,
      originalPrice: 450,
      image: 'https://images.unsplash.com/photo-1543362906-ac1b4f87e9c9?w=600&auto=format&fit=crop&q=60'
    },
    {
      id: 4,
      name: 'Coconut Shell Bowl Set',
      price: 599,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1603199892358-c03b31b87820?w=600&auto=format&fit=crop&q=60'
    }
  ]

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
