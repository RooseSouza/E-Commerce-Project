import axios from "axios";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

const EditProductModal = ({ product, categories, token, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    categoryName: product.categoryId.name,
    stockQuantity: product.stock.quantity,
    stockUnit: product.stock.unit,
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v !== null && data.append(k, v));

    await axios.put(`${API_BASE}/api/products/${product._id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded space-y-3 w-full max-w-lg">
        <h2 className="text-xl font-bold">Edit Product</h2>

        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border p-2" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border p-2" />
        <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border p-2" />

        <select value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} className="w-full border p-2">
          {categories.map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />

        <button className="bg-blue-600 text-white p-2 rounded w-full">Update</button>
        <button type="button" onClick={onClose} className="w-full border p-2">Cancel</button>
      </form>
    </div>
  );
};

export default EditProductModal;
