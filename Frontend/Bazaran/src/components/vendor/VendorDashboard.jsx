import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import Header from "./DashboardHeader.jsx";
import ProductList from "./ProductList.jsx";
import AddProductForm from "./AddProductForm.jsx";
import EditProductModal from "./EditProductModal.jsx";
import DashboardCards from "./DashBoardCard.jsx"; // unified cards for products & orders
import EditProfileModal from "../EditProfileModal";
import VendorOrders from "./VendorOrders.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;

const VendorDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [vendor, setVendor] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [view, setView] = useState("dashboard");
  const [editProduct, setEditProduct] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [productFilter, setProductFilter] = useState("total"); // total/active/inactive/outOfStock
  const [orderFilter, setOrderFilter] = useState("all");
// all | placed | confirmed | dispatched | delivered | cancelled


  const authHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchVendor = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/me`, { headers: authHeader });
      setVendor(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products/my-products`, { headers: authHeader });
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(res.data.categories || res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders/vendor`, { headers: authHeader });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchVendor();
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, []);

  /* ---------------- PRODUCT ACTIONS ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axios.delete(`${API_BASE}/api/products/${id}`, { headers: authHeader });
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const handleToggle = async (id) => {
    await axios.put(`${API_BASE}/api/products/${id}/toggle-status`, {}, { headers: authHeader });
    fetchProducts();
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
  };

  /* ---------------- PROFILE ---------------- */
  const handleProfileUpdate = async (formData) => {
    try {
      const res = await axios.put(`${API_BASE}/api/users/me`, formData, { headers: authHeader });
      setVendor(res.data);
      setShowProfileModal(false);
      return {};
    } catch (err) {
      return err.response?.data || { message: "Update failed" };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* PROFILE MODAL */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={vendor}
        onSave={handleProfileUpdate}
      />

      {/* HEADER */}
      <Header
        vendor={vendor}
        onLogout={handleLogout}
        onProfileClick={() => setShowProfileModal(true)}
      />

 <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar vendor={vendor} setView={setView} currentView={view} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">


          {/* DASHBOARD */}
          {view === "dashboard" && (
            <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
Welcome back, {vendor?.name}</h1>

              {/* PRODUCT + ORDER CARDS */}
                              <DashboardCards
                    products={products}
                    orders={orders}

                    activeProductFilter={productFilter}
                    activeOrderFilter={orderFilter}

                    onProductCardClick={(filter) => {
                      setProductFilter(filter);
                      setView("list"); // go to product list
                    }}

                    onOrderCardClick={(status) => {
                      setOrderFilter(status);
                      setView("orders"); // go to orders page
                    }}
                  />

            </div>
          )}

          {/* ADD PRODUCT */}
          {view === "add" && (
            <AddProductForm
              categories={categories}
              token={token}
              fetchProducts={fetchProducts}
              onClose={() => setView("list")}
            />
          )}

          {/* PRODUCT LIST */}
          {view === "list" && (
            <ProductList
              products={products}
              onEdit={setEditProduct}
              onDelete={handleDelete}
              onToggle={handleToggle}
              productFilter={productFilter}
            />
          )}

          {/* EDIT PRODUCT MODAL */}
          {editProduct && (
            <EditProductModal
              product={editProduct}
              categories={categories}
              token={token}
              onClose={() => setEditProduct(null)}
              onUpdated={handleProductUpdated}
            />
          )}

          {/* ORDERS */}
          {view === "orders" && (
            <VendorOrders
              token={token}
              orderFilter={orderFilter}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
