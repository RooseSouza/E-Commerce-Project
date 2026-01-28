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
      name: 'Goan Clay Cooking Pot (Kundlem)',
      price: 550,
      originalPrice: 750,
      image: 'https://images.pexels.com/photos/33947401/pexels-photo-33947401.jpeg'
    },
    {
      id: 2,
      name: 'Handmade Crochet top',
      price: 1200,
      originalPrice: 1800,
      image: 'https://images.pexels.com/photos/7585263/pexels-photo-7585263.jpeg'
    },
    {
      id: 3,
      name: 'Traditional Brass Lamp (Samai)',
      price: 1250,
      originalPrice: 1800,
      image: 'https://images.pexels.com/photos/34705732/pexels-photo-34705732.jpeg'
    },
    {
      id: 4,
      name: 'Coconut Shell Bowl Set',
      price: 599,
      originalPrice: 999,
      image: 'https://images.pexels.com/photos/34876038/pexels-photo-34876038.jpeg'
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
