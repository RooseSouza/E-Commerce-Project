import React from 'react'

const FeaturedBannerSection = () => {
  const bannerItems = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1765077613984-87e023a96501?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2VhJTIwc2hlbGwlMjBhcnRzfGVufDB8fDB8fHww',
      title: 'Coastal Shell Art',
      subtitle: 'Treasures from the sea',
      size: 'large' // Left side large card
    },
    {
      id: 2,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcuAQZM1BOJKlh3yCu0FLZD4D7YEpBDzL_vQ&s',
      title: 'Goan Delicacies',
      subtitle: 'Sweets & Savories',
      size: 'small' // Top right small card
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1611692478827-a99d664c3715?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29jb251dCUyMHNoZWxsJTIwYXJ0fGVufDB8fDB8fHww',
      title: 'Coconut Decor',
      subtitle: 'Sustainable Living',
      size: 'small' // Bottom right small card
    }
  ]

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg">
            Discover our handpicked selections
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Card - Left Side */}
          <div className="lg:col-span-1 lg:row-span-2">
            <div className="relative h-96 lg:h-full rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage: `url(${bannerItems[0].image})`,
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">
                  {bannerItems[0].title}
                </h3>
                <p className="text-gray-100 drop-shadow-md">
                  {bannerItems[0].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Two Cards Stacked */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Top Right Small Card */}
            <div className="relative h-56 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage: `url(${bannerItems[1].image})`,
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">
                  {bannerItems[1].title}
                </h3>
                <p className="text-sm text-gray-100 drop-shadow-md">
                  {bannerItems[1].subtitle}
                </p>
              </div>
            </div>

            {/* Bottom Right Small Card */}
            <div className="relative h-56 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage: `url(${bannerItems[2].image})`,
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">
                  {bannerItems[2].title}
                </h3>
                <p className="text-sm text-gray-100 drop-shadow-md">
                  {bannerItems[2].subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedBannerSection
