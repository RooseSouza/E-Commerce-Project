import React from 'react'
import ItemCard from '../components/itemcard'
import imgBanner from '../assets/img5.jpg'
import imgBanner2 from '../assets/img6.jpg'

const GoanSaleSection = () => {
  // Sample product data for top picks
  const topPicksProducts = [
    {
      id: 1,
      name: 'Goan spices',
      price: 1299,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1643824562770-f94d32874f72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3BpY2VzJTIwbWFya2V0fGVufDB8fDB8fHww'
    },
    {
      id: 2,
      name: 'Ceramic Dinner Set',
      price: 1899,
      originalPrice: 3499,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Woven Basket',
      price: 899,
      originalPrice: 1799,
      image: 'https://images.unsplash.com/photo-1626037235530-fe56de7d6459?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d292ZW4lMjBiYXNrZXR8ZW58MHx8MHx8fDA%3D'
    },
    {
      id: 4,
      name: 'Brass Decorative Plate',
      price: 1599,
      originalPrice: 2999,
      image: 'https://images.pexels.com/photos/31959766/pexels-photo-31959766.jpeg'
    }
  ]

  // Top product categories
  const topCategories = [
    {
      id: 1,
      name: 'Leather works',
      price: 'from ₹1299',
      image: 'https://media.istockphoto.com/id/2162881733/photo/macro-shot-showing-camel-skin-sandals-called-jooti-juti-jutti-popular-in-punjab-rajasthan.webp?s=2048x2048&w=is&k=20&c=sx4T980e2Ib8YvDXfywbJFmtV2b_op9Wz0rEFsZw5qo='
    },
    {
      id: 2,
      name: 'Earthern utensils',
      price: 'from ₹849',
      image: 'https://images.unsplash.com/photo-1671167051711-1fcc8ddd7d40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGluZGlhbiUyMGVhcnRoZW58ZW58MHx8MHx8fDA%3D'
    },
    {
      id: 3,
      name: 'Men and Women Fashion',
      price: 'from ₹1599',
      image: 'https://plus.unsplash.com/premium_photo-1691030256235-47d75d5890b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aW5kaWFuJTIwbWVuJTIwYW5kJTIwd29tZW4lMjBmYXNoaW9uJTIwbW9kZWx8ZW58MHx8MHx8fDA%3D'
    },
    {
      id: 4,
      name: 'Metal artifacts',
      price: 'from ₹1999',
      image: 'https://images.unsplash.com/photo-1763475945701-8ae7b56eb69f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D'
    },
    {
      id: 5,
      name: 'Bamboo products',
      price: 'from ₹599',
      image: 'https://plus.unsplash.com/premium_photo-1664392230823-2b48a024c2df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8QmFtYm9vJTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D'
    }
  ]

  return (
    <div className="w-full bg-gray-50">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Monofett&display=swap');`}
      </style>
      {/* Hero Banner - Great Goan Sale */}
      <section className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imgBanner})`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Banner Text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal text-white mb-2 tracking-wider" style={{ fontFamily: "'Monofett', monospace"  }}>
            THE GREAT GOAN SALE
          </h1>
          <p className="text-xl md:text-3xl lg:text-4xl font-normal text-white">
            DISCOUNTS UP TO 90%
          </p>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Top products</h2>

          {/* Circular Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {topCategories.map((category) => (
              <div key={category.id} className="flex flex-col items-center text-center group cursor-pointer">
                {/* Circular Image */}
                <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full shadow-lg group-hover:shadow-2xl transition-shadow">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Category Name */}
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                {/* Price Range */}
                <p className="text-xs md:text-sm text-gray-600">
                  {category.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Picks by Experts Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Product Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Top picks by experts</h2>
              <div className="grid grid-cols-2 gap-6">
                {topPicksProducts.map((product) => (
                  <ItemCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Right Side - Promotional Banner */}
            <div className="relative h-96 lg:h-auto min-h-96 overflow-hidden rounded-lg shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    `url(${imgBanner2})`,
                }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Promo Text and Button */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 py-8">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  The Best of
                  <br />
                  Handicrafts
                </h3>
                <p className="text-lg text-gray-200 mb-8">
                  Best handmade and wooden
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block">
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GoanSaleSection
