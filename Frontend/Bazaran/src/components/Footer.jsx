import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo1.png'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      console.log('Subscribed with email:', email)
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-amber-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Social Media */}
          <div className="lg:col-span-1">
                       <img src={`${Logo}`} alt="Logo" className="h-12 w-auto" />
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-200 transition-colors text-lg">
                <i className="fab fa-facebook">f</i>
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors text-lg">
                <i className="fab fa-twitter">𝕏</i>
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors text-lg">
                <i className="fab fa-instagram">📷</i>
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors text-lg">
                <i className="fab fa-linkedin">in</i>
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors text-lg">
                <i className="fab fa-youtube">▶</i>
              </a>
            </div>
          </div>

          {/* Our Readables */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Readables</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                 Blogs
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Goan Stories
                </Link>
              </li>
             
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-amber-200 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-amber-200 transition-colors text-sm">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="hover:text-amber-200 transition-colors text-sm">
                  Our Vendors
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-200 transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="hover:text-amber-200 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-200 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-amber-200 transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-amber-200 transition-colors text-sm">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe Us</h3>
            <p className="text-sm text-amber-100 mb-4">
              Subscribe to our newsletter for the latest updates and offers
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-3 py-2 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
            
            {subscribed && (
              <div className="mt-2 p-2 bg-green-500/30 text-green-100 rounded text-xs text-center">
                ✓ Thanks for subscribing!
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-amber-800 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-sm text-amber-100">
          <p>© 2026 Bazaran. All rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
