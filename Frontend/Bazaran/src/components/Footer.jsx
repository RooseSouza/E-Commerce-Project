import React, { useState } from "react"
import { Link } from "react-router-dom"
import Logo from "../assets/logo2.png"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!email) return

    try {
      setLoading(true)

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Subscription failed")
      }

      setMessage("✓ Thanks for subscribing! Check your email 📧")
      setEmail("")

      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-orange-500 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Logo */}
          <div>
            <img src={Logo} alt="Logo" className="h-12 mb-5" />
            <div className="flex gap-4 text-lg">
              <a href="#">f</a>
              <a href="#">𝕏</a>
              <a href="#">📷</a>
              <a href="#">in</a>
              <a href="#">▶</a>
            </div>
          </div>

          {/* Readables */}
          <div>
            <h3 className="font-bold mb-4">Our Readables</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#">Articles</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Goan Stories</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop Products</Link></li>
              <li><Link to="/vendors">Our Vendors</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/returns">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4">Subscribe Us</h3>
            <p className="text-sm mb-4">
              Get updates, offers & stories straight to your inbox
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-3 py-2 rounded text-gray-900 text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 py-2 rounded text-sm font-bold disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {message && (
              <div className="mt-2 text-green-200 text-xs">{message}</div>
            )}

            {error && (
              <div className="mt-2 text-red-200 text-xs">{error}</div>
            )}
          </div>
        </div>

        <div className="border-t border-amber-800 my-6"></div>

        <p className="text-center text-sm">
          © 2026 Bazaran. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
