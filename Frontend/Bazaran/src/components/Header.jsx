import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import img1 from '../assets/img7.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'



const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const slides = [
    {
      id: 1,
      image: `${img2}`,
      title: 'The Goan Flowers',
      subtitle: 'From the flowers of beds',
      tagline: 'Fresh and Vibrant'
    },
    
    {
      id: 2,
      image: `${img3}`,
      title: 'Local Products',
      subtitle: 'Support Local Vendors',
      tagline: 'Best Quality Guaranteed'
    },
    {
      id: 3,
      image: `${img1}`,
      title: 'Fresh & Healthy',
      subtitle: 'Your wellness matters',
      tagline: 'Premium Selection'
    }
  ]

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [autoPlay, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAutoPlay(false)
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Carousel/Hero Section */}
      <div className="relative w-full h-96 lg:h-[500px] overflow-hidden bg-gray-900">
        {/* Slides Container */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-12 lg:px-20">
                  <div className="max-w-2xl">
                    <div className="mb-4">
                      <p className="text-orange-400 font-semibold text-sm md:text-base tracking-wider">
                        {slide.tagline}
                      </p>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8">
                      {slide.subtitle}
                    </p>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 md:p-3 rounded-full transition-colors duration-200 group"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 md:p-3 rounded-full transition-colors duration-200"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-orange-500 w-8'
                  : 'bg-white/50 hover:bg-white/70 w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-6 right-6 z-20 text-white bg-black/40 px-4 py-2 rounded-lg font-semibold">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </>
  )
}

export default Header
