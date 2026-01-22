import React, { useState } from 'react'
import { Link } from 'react-router-dom'

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
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-amber-900 font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-bold">BAZARAN</span>
            </Link>
            
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
                  Link 1
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 2
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 3
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 4
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 1
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 2
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 3
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 4
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 1
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 2
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 3
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-200 transition-colors text-sm">
                  Link 4
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
