import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

const EditProductModal = ({ product, categories, token, onClose, onUpdated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockUnit, setStockUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);


  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setStockQuantity(product.stock?.quantity || "");
      setStockUnit(product.stock?.unit || "piece");
      setCategoryId(product.categoryId?._id || "");
      setImage(null);
      setPreviewImage(product.image?.url || null);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Category is required");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("price", Number(price));
    data.append("stockQuantity", Number(stockQuantity));
    data.append("stockUnit", stockUnit);
    data.append("categoryId", categoryId);
    if (image) data.append("image", image);

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
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Product
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="Stock Qty"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={stockUnit}
              onChange={(e) => setStockUnit(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="piece">piece</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="litre">litre</option>
              <option value="ml">ml</option>
              <option value="pack">pack</option>
            </select>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

        <input
  type="file"
  onChange={(e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file)); // show new selected file
  }}
  className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100"
/>
</div>

        {previewImage && (
  <div className="mb-3">
    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
    <img
      src={previewImage}
      alt="Product Preview"
      className="w-32 h-32 object-cover rounded-lg border"
    />
  </div>
)}


        {/* Actions */}
        <div className="flex gap-3 pt-3">
          <button
            type="submit"
            className="flex-1 bg-orange-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Update Product
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;
