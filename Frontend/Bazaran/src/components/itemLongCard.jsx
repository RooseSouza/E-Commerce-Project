import React from 'react'

const ItemLongCard = ({ 
  image, 
  title, 
  subtitle, 
  discount, 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="relative h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 text-white">
        {/* Top - Discount Badge */}
        {discount && (
          <div className="self-start">
            <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-bold text-lg">
              {discount}
            </div>
          </div>
        )}

        {/* Bottom - Title and Subtitle */}
        <div className="self-start space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-gray-100 drop-shadow-md">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/50 rounded-lg transition-all duration-300"></div>
    </div>
  )
}

export default ItemLongCard
