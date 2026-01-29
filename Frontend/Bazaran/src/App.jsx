import React from 'react'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Home from './pages/Home'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import UserProfile from './pages/UserProfile'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import UserProvider from './context/userContext'
import VendorDashboard from './pages/VendorDashboard'

const App = () => {
  return (
    <div className='App'>
      <UserProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
               <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            </Routes>
          </Router>
        </div>
      </UserProvider>

    </div>
  )
}

export default App


const Root = () => {

  //check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  //redirect to dashboard if authenticated, otherwise to login

  return isAuthenticated ?
    (
      <Navigate to="/home" />
    ) :
    (
      <Navigate to="/home" />
    )
}
