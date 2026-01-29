import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

const EditProductModal = ({ product, categories, token, onClose, onUpdated }) => {
  // Initialize state when modal opens
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockUnit, setStockUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);

  // Populate state when product changes (important!)
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setStockQuantity(product.stock?.quantity || "");
      setStockUnit(product.stock?.unit || "");
      setCategoryId(product.categoryId?._id || "");
      setImage(null); // Reset image
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Update product in parent dashboard immediately
      onUpdated(res.data.product);

      onClose();
    } catch (err) {
      console.error("Error updating product:", err.response?.data || err.message);
      alert("Failed to update product. Check console for details.");
    }
  };

  if (!product) return null; // Safety check

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded space-y-3 w-full max-w-lg">
        <h2 className="text-xl font-bold">Edit Product</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2"
          placeholder="Product Name"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2"
          placeholder="Description"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2"
          placeholder="Price"
          required
        />

        <input
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          className="w-full border p-2"
          placeholder="Stock Quantity"
        />

        <select
          value={stockUnit}
          onChange={(e) => setStockUnit(e.target.value)}
          className="w-full border p-2"
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
          className="w-full border p-2"
        >
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button className="bg-blue-600 text-white p-2 rounded w-full">Update Product</button>
        <button type="button" onClick={onClose} className="w-full border p-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProductModal;
