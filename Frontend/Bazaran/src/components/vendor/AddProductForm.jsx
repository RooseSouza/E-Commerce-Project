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
    <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Name
          </label>
          <input
            name="name"
            onChange={handleChange}
            required
            placeholder="Enter product name"
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            required
            placeholder="Product description"
            rows={3}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2 bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quantity
            </label>
            <input
              name="stockQuantity"
              type="number"
              onChange={handleChange}
              required
              placeholder="Qty"
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Unit
            </label>
            <select
              name="stockUnit"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="piece">Piece</option>
              <option value="kg">Kg</option>
              <option value="g">Gram</option>
              <option value="litre">Litre</option>
              <option value="ml">ML</option>
              <option value="pack">Pack</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Image
          </label>
          <input
            type="file"
            required
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
            className="w-full text-sm file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-orange-100 file:text-orange-700
                       hover:file:bg-orange-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 shadow"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
