import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

const EditProductModal = ({ product, categories, token, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
    stockUnit: "piece",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        categoryId: product.categoryId?._id || "",
        stockQuantity: product.stock?.quantity || "",
        stockUnit: product.stock?.unit || "piece",
        image: null,
      });
      setPreviewImage(product.image?.url || null);
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append(
      "categoryId",
      form.categoryId
    );
    data.append("stockQuantity", form.stockQuantity);
    data.append("stockUnit", form.stockUnit);
    if (form.image) data.append("image", form.image);

    try {
      const res = await axios.put(
        `${API_BASE}/api/products/${product._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdated(res.data.product);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Product
        </h2>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Name
          </label>
          <input
            name="name"
            value={form.name}
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
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Product description"
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
              value={form.price}
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
              value={form.categoryId}
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
              value={form.stockQuantity}
              onChange={handleChange}
            
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
              value={form.stockUnit}
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
            onChange={handleImageChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-orange-100 file:text-orange-700
                       hover:file:bg-orange-200"
          />
        </div>

        {/* Preview */}
        {previewImage && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Image:</p>
            <img
              src={previewImage}
              alt="Product Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

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
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;
