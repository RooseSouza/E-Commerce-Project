import React from 'react'

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 text-4xl">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

export default FeatureCard
