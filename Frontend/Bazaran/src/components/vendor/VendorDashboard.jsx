import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import Header from "./DashboardHeader.jsx";
import ProductList from "./ProductList.jsx";
import AddProductForm from "./AddProductForm.jsx";
import EditProductModal from "./EditProductModal.jsx";
import DashBoardCards from "./DashBoardCard.jsx";
import EditProfileModal from "../EditProfileModal";
import VendorOrders from "./VendorOrders.jsx";


const API_BASE = import.meta.env.VITE_API_BASE;

const VendorDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [vendor, setVendor] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("dashboard");
  const [editProduct, setEditProduct] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchVendor = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/me`, {
        headers: authHeader,
      });
      setVendor(res.data);
    } catch (err) {
      // Token invalid / expired
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  const fetchProducts = async () => {
    const res = await axios.get(
      `${API_BASE}/api/products/my-products`,
      { headers: authHeader }
    );
    setProducts(res.data.products || res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_BASE}/api/categories`);
    setCategories(res.data.categories || res.data);
  };

  useEffect(() => {
    fetchVendor();
    fetchProducts();
    fetchCategories();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axios.delete(`${API_BASE}/api/products/${id}`, {
      headers: authHeader,
    });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleToggle = async (id) => {
    await axios.put(
      `${API_BASE}/api/products/${id}/toggle-status`,
      {},
      { headers: authHeader }
    );
    fetchProducts();
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === updatedProduct._id ? updatedProduct : p
      )
    );
  };

  /* ---------------- PROFILE UPDATE ---------------- */
  const handleProfileUpdate = async (formData) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/users/me`,
        formData,
        { headers: authHeader }
      );

      setVendor(res.data);
      setShowProfileModal(false);
      return {};
    } catch (err) {
      return err.response?.data || { message: "Update failed" };
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true }); // 🔥 prevents back navigation
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

      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar
          vendor={vendor}
          setView={setView}
          currentView={view}
        />

        <main className="flex-1 p-6 overflow-y-auto">

          {/* DASHBOARD */}
          {view === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">
                Welcome back, {vendor?.name}
              </h1>
              <DashBoardCards products={products} />
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

          {view === "orders" && (
  <VendorOrders token={token} />
)}


        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
