import React from 'react'
import ItemLongCard from '../components/itemLongCard'

const LongCardsSection = () => {
  const cardsData = [
    {
      id: 1,
      image: 'https://plus.unsplash.com/premium_photo-1671245156908-61e26926cef9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'The Goan Flowers',
      subtitle: 'From the flowers of beds',
      discount: 'Sale 70%'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=500&fit=crop',
      title: 'Artisan Crafts',
      subtitle: 'Handmade with passion',
      discount: 'Up to 60%'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1655149588581-49191c89e470?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Wooden Wonders',
      subtitle: 'Premium quality items',
      discount: 'Sale 50%'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=500&fit=crop',
      title: 'Ceramic Collection',
      subtitle: 'Elegant designs',
      discount: 'Sale 65%'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=500&fit=crop',
      title: 'Metal Artifacts',
      subtitle: 'Timeless beauty',
      discount: 'Up to 55%'
    },
    {
      id: 6,
      image: 'https://media.assettype.com/gomantaktimes/2025-03-01/wi7zkri7/IMG1970.jpg',
      title: 'Cultural Heritage',
      subtitle: 'Traditional crafts',
      discount: 'Sale 75%'
    }
  ]

  const handleCardClick = (cardId) => {
    console.log(`Clicked card ${cardId}`)
    // TODO: Navigate to product details or category page
  }

  return (
    <div className="w-full bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Special Collections
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our curated collections with amazing discounts
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cardsData.map((card) => (
            <ItemLongCard
              key={card.id}
              image={card.image}
              title={card.title}
              subtitle={card.subtitle}
              discount={card.discount}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LongCardsSection
