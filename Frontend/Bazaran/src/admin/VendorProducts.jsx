import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE;

const VendorProducts = () => {
  const { vendorId } = useParams();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorProducts();
  }, [vendorId]);

  const fetchVendorProducts = async () => {
    try {
      const res = await axios.get(
        `${API}/api/admin/vendors/${vendorId}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch vendor products error", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (productId) => {
    try {
      await axios.patch(
        `${API}/api/admin/products/${productId}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchVendorProducts(); // refresh list
    } catch (err) {
      console.error("Toggle product error", err);
    }
  };

const deleteProduct = async (productId) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await axios.delete(
      `${API}/api/admin/products/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setProducts((prev) => prev.filter((p) => p._id !== productId));
  } catch (error) {
    console.error("Delete product failed:", error.response?.data || error.message);
    alert("Failed to delete product");
  }
};


if (loading) return <p>Loading vendor products...</p>;

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold mb-6">Vendor Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">This vendor has no products</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Price</th>
                <th className="border px-3 py-2">Stock</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td className="border px-3 py-2">{index + 1}</td>

                  <td className="border px-3 py-2 flex items-center gap-3">
                    <img
                      src={product.image?.url}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span>{product.name}</span>
                  </td>

                  <td className="border px-3 py-2">
                    {product.categoryId?.name}
                  </td>

                  <td className="border px-3 py-2">₹{product.price}</td>

                  <td className="border px-3 py-2">
                    {product.stock?.quantity} {product.stock?.unit}
                  </td>

                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="border px-3 py-2">
                    <button
                      onClick={() => toggleStatus(product._id)}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        product.isActive
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {product.isActive ? "Disable" : "Enable"}
                    </button>

                    
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="px-2 py-1 rounded bg-gray-800 text-white text-xs"
                        >
                          Delete
                        </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
