import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* ================= AUTH ================= */
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

/* ================= USER ================= */
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import UserProfile from "./pages/UserProfile";

/* ================= VENDOR ================= */
import VendorDashboard from "./pages/VendorDashboard";

/* ================= ADMIN ================= */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import Vendors from "./admin/Vendors";
import VendorProducts from "./admin/VendorProducts";

/* ================= CONTEXT & ROUTES ================= */
import UserProvider from "./context/userContext";
import ProtectedRoute from "./route/ProtectedRoutes";
import AdminRoute from "./route/AdminRoute";


import CategoryProducts from './pages/CategoryProducts'
import OrdersPage from "./pages/OrdersPage"
import Checkout from './pages/Checkout'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>

          {/* ROOT */}
          <Route path="/" element={<RootRedirect />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* USER ROUTES */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:productId"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
              
              <Route path="/products" element={<CategoryProducts />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrdersPage />} />

          {/* VENDOR */}
          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES (NESTED) ================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            {/* Default admin page */}
            <Route index element={<AdminDashboard />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/:vendorId" element={<VendorProducts />} />
          </Route>

          {/* 404 FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </UserProvider>
  );
};

/* ================= ROOT REDIRECT ================= */
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" />;

  if (user?.role === "admin") return <Navigate to="/admin" />;
  if (user?.role === "vendor") return <Navigate to="/vendor-dashboard" />;

  return <Navigate to="/home" />;
};

export default App;
