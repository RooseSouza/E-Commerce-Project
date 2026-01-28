import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiLogOut, FiPlusSquare, FiBox } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_BASE;

const ProfessionalVendorDashboard = () => {
  const [vendor, setVendor] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryName: "",
    stockQuantity: "",
    stockUnit: "piece",
    image: null,
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/products/my-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  const fetchVendor = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch vendor info
  useEffect(() => {
    if (!token) return;

    fetchVendor();
    fetchCategories();
    fetchProducts();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.image && !editingProductId) {
    setMessage("Please upload an image");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    if (editingProductId) {
      await axios.put(
        `${API_BASE}/api/products/${editingProductId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axios.post(
        `${API_BASE}/api/products`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    setMessage(editingProductId ? "Product updated!" : "Product added!");

    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      stockQuantity: "",
      stockUnit: "piece",
      image: null,
    });

    setEditingProductId(null);
    fetchProducts();
    setActiveTab("products");
  } catch (error) {
    console.error(error);
    setMessage(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      categoryId: product.categoryId?._id || "", // ✅ ID, not name
      stockQuantity: product.stock?.quantity || "",
      stockUnit: product.stock?.unit || "piece",
      image: null,
    });
    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Product deleted successfully");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (product) => {
    try {
      await axios.put(
        `${API_BASE}/api/products/${product._id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProducts(
        products.map((p) =>
          p._id === product._id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="p-6 text-xl font-bold border-b">Vendor Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 p-2 w-full rounded hover:bg-gray-200 ${activeTab === "add" ? "bg-gray-200 font-semibold" : ""}`}
          >
            <FiPlusSquare /> Add Product
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 p-2 w-full rounded hover:bg-gray-200 ${activeTab === "products" ? "bg-gray-200 font-semibold" : ""}`}
          >
            <FiBox /> My Products
          </button>
        </nav>
        <div className="p-4 border-t flex items-center justify-between">
          <span className="text-sm">{vendor.name}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700"
          >
            <FiLogOut />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "add" && (
          <div className="bg-white p-6 shadow rounded max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProductId ? "Edit Product" : "Add New Product"}
            </h2>
            {message && <p className="mb-4 text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border rounded p-2 flex-1"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  required
                />
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="border rounded p-2 flex-1"
                  required
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="border rounded p-2 flex-1"
                  placeholder="Stock Quantity"
                  min="0"
                  required
                />
                <select
                  name="stockUnit"
                  value={formData.stockUnit}
                  onChange={handleChange}
                  className="border rounded p-2 flex-1"
                >
                  <option value="piece">Piece</option>
                  <option value="kg">Kg</option>
                  <option value="g">Gram</option>
                  <option value="litre">Litre</option>
                  <option value="ml">ML</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700"
              >
                {loading
                  ? "Processing..."
                  : editingProductId
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Products</h2>
            {products.length === 0 && <p>No products found.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white shadow rounded p-4 flex flex-col"
                >
                  <img
                    src={product.image.url}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2 rounded"
                  />
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-500">
                    Category: {product.categoryId.name}
                  </p>
                  <p className="text-gray-500">Price: ${product.price}</p>
                  <p className="text-gray-500">
                    Stock: {product.stock.quantity} {product.stock.unit}
                  </p>
                  <p
                    className={`mb-2 font-medium ${product.isActive ? "text-green-600" : "text-red-600"}`}
                  >
                    Status: {product.isActive ? "Active" : "Disabled"}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggle(product)}
                      className={`flex-1 ${product.isActive ? "bg-gray-500" : "bg-green-500"} text-white p-1 rounded hover:opacity-90`}
                    >
                      {product.isActive ? "Disable" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfessionalVendorDashboard;
