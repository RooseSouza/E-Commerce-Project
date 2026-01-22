import React from 'react'
import ItemCard from '../components/itemcard'
import CTA from '../components/CTA'

const CTAproducts = () => {
  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Product A',
      price: 1299,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1590080876-e7de9e7cc9a5?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Product A',
      price: 1599,
      originalPrice: 3199,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Product A',
      price: 1399,
      originalPrice: 2799,
      image: 'https://images.unsplash.com/photo-1595521624623-456be06cc8e0?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Product A',
      price: 1199,
      originalPrice: 2399,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Product A',
      price: 1499,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop'
    }
  ]

  // Just arrived products data
  const justArrivedProducts = [
    {
      id: 6,
      name: 'Product A',
      price: 1299,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1590080876-e7de9e7cc9a5?w=300&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Product A',
      price: 1599,
      originalPrice: 3199,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Product A',
      price: 1399,
      originalPrice: 2799,
      image: 'https://images.unsplash.com/photo-1595521624623-456be06cc8e0?w=300&h=300&fit=crop'
    },
    {
      id: 9,
      name: 'Product A',
      price: 1199,
      originalPrice: 2399,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=300&fit=crop'
    },
    {
      id: 10,
      name: 'Product A',
      price: 1499,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop'
    }
  ]

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
