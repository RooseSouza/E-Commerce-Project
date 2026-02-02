import React, { useState, useEffect } from 'react'
import FeatureCard from './FeatureCard'

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const FeaturesSection = () => {
  const [features, setFeatures] = useState([])

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/features`)
        const data = await response.json()
        if (Array.isArray(data)) {
          const activeFeatures = data.filter(f => f.isActive !== false && !f.isDisabled)
          setFeatures(activeFeatures)
        }
      } catch (error) {
        console.error('Error fetching features:', error)
      }
    }

    fetchFeatures()
  }, [])

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
