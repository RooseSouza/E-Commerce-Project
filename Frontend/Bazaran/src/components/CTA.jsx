import React, { useState } from 'react'

const CTA = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [subscribed, setSubscribed] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (formData.email && formData.password) {
      console.log('Subscribed with:', formData)
      setSubscribed(true)
      setFormData({ email: '', password: '' })
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1588590294888-042cd70261ba?w=1400&h=400&fit=crop)',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full">
        {/* Left Side - Text */}
        <div className="flex-1 text-white mb-6 md:mb-0">
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Missed any offer?
            <br />
            <span className="text-green-500">Subscribe us</span>
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 md:flex-shrink-0 md:w-80">
          <form onSubmit={handleSubscribe} className="space-y-4">
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />

            {/* Password Input */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />

            {/* Subscribe Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>

          {/* Success Message */}
          {subscribed && (
            <div className="mt-4 p-3 bg-green-500/90 text-white rounded-lg text-center font-semibold animate-pulse">
              ✓ Successfully subscribed!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CTA
