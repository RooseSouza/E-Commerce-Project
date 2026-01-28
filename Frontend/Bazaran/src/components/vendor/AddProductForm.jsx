import axios from "axios";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

const AddProductForm = ({ categories, token, fetchProducts, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
    stockUnit: "piece",
    image: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append(
      "categoryName",
      categories.find((c) => c._id === form.categoryId)?.name
    );
    data.append("stockQuantity", form.stockQuantity);
    data.append("stockUnit", form.stockUnit);
    data.append("image", form.image);

    await axios.post(`${API_BASE}/api/products`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProducts();
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" onChange={handleChange} required placeholder="Name" className="w-full border p-2" />
        <textarea name="description" onChange={handleChange} required placeholder="Description" className="w-full border p-2" />
        <input name="price" type="number" onChange={handleChange} required placeholder="Price" className="w-full border p-2" />

        <select name="categoryId" onChange={handleChange} required className="w-full border p-2">
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <input name="stockQuantity" type="number" onChange={handleChange} required placeholder="Qty" className="border p-2 flex-1" />
          <select name="stockUnit" onChange={handleChange} className="border p-2 flex-1">
            <option value="piece">Piece</option>
            <option value="kg">Kg</option>
            <option value="g">Gram</option>
          </select>
        </div>

        <input type="file" required onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />

        <button className="bg-blue-600 text-white p-2 rounded w-full">Save</button>
      </form>
    </div>
  );
};

export default AddProductForm;
