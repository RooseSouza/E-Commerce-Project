import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar.jsx";
import ProductList from "./ProductList.jsx";
import AddProductForm from "./AddProductForm.jsx";
import EditProductModal from "./EditProductModal.jsx";


const API_BASE = import.meta.env.VITE_API_BASE;

const VendorDashboard = () => {
  const token = localStorage.getItem("token");

  const [vendor, setVendor] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("list"); 
  const [editProduct, setEditProduct] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- FETCH DATA ---------------- */
  const fetchVendor = async () => {
    const res = await axios.get(`${API_BASE}/api/users/me`, { headers: authHeader });
    setVendor(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE}/api/products/my-products`, { headers: authHeader });
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
    await axios.delete(`${API_BASE}/api/products/${id}`, { headers: authHeader });
    fetchProducts();
  };

  const handleToggle = async (id) => {
    await axios.put(`${API_BASE}/api/products/${id}/toggle-status`, {}, { headers: authHeader });
    fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-100">
    
    <Sidebar
  
  vendor={vendor}
  setView={setView}
  handleLogout={handleLogout}
/>


      <main className="flex-1 p-6 overflow-y-auto">
  
          {view === "add" && (
  <AddProductForm
    categories={categories}
    token={token}
    fetchProducts={fetchProducts}
    onClose={() => setView("list")}
  />
)}

{view === "list" && (
  <ProductList
    products={products}
    onEdit={setEditProduct}
    onDelete={handleDelete}
    onToggle={handleToggle}
  />
)}


        {editProduct && (
          <EditProductModal
            product={editProduct}
            categories={categories}
            token={token}
            onClose={() => setEditProduct(null)}
            onUpdated={fetchProducts}
          />
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;
