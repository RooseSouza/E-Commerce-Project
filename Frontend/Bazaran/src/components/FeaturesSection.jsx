import React from 'react'
import FeatureCard from './FeatureCard'

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: '🚚',
      title: 'Free Delivery',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt adipisicing elit. Nesciunt'
    },
    {
      id: 2,
      icon: '⏱️',
      title: 'Timely delivery',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt adipisicing elit. Nesciunt'
    },
    {
      id: 3,
      icon: '✓',
      title: 'Multi-Quality checks',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt adipisicing elit. Nesciunt'
    },
    {
      id: 4,
      icon: '🎧',
      title: '24/7 Customer Service',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt adipisicing elit. Nesciunt'
    }
  ]

  return (
    <section className="py-12 lg:py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
