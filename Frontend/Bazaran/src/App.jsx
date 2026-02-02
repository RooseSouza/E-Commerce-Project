import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* ================= AUTH ================= */
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

/* ================= USER ================= */
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import UserProfile from "./pages/UserProfile";
import Checkout from "./pages/Checkout";
import CategoryProducts from "./pages/CategoryProducts";
import OrdersPage from "./pages/OrdersPage";

/* ================= VENDOR ================= */
import VendorDashboard from "./pages/VendorDashboard";

/* ================= ADMIN ================= */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import Vendors from "./admin/Vendors";
import VendorProducts from "./admin/VendorProducts";
import Users from "./admin/Users";
import Products from "./admin/Products";
/* ================= CONTEXT & ROUTES ================= */
import UserProvider from "./context/userContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./route/ProtectedRoutes";
import AdminRoute from "./route/AdminRoute";

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <Router>
          <Routes>
          {/* ROOT */}
          <Route path="/" element={<RootRedirect />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* USER ROUTES (PUBLIC) */}
          <Route path="/home" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/products" element={<CategoryProducts />} />

          {/* USER ROUTES (PROTECTED) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
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

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />


          {/* VENDOR */}
          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN (NESTED ROUTES) */}
        <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="vendors" element={<Vendors />} />
  <Route path="vendors/:vendorId" element={<VendorProducts />} />
  <Route path="users" element={<Users />} />
  <Route path="products" element={<Products />} />
</Route>


          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </UserProvider>
  );
};

/* ================= ROOT REDIRECT ================= */
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔑 Role-based redirect
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "vendor") return <Navigate to="/vendor-dashboard" replace />;

  // ✅ Normal user
  return <Navigate to="/home" replace />;
};

export default App;
