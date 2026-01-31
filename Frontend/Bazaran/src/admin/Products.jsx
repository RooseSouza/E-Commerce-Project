import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "../components/AdminStatusBadge";

const API = import.meta.env.VITE_API_BASE;

const Products = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `${API}/api/admin/products/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProducts();
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-6">All Products</h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Product</th>
              <th className="border px-3 py-2">Vendor</th>
              <th className="border px-3 py-2">Category</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr key={p._id}>
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2 font-medium">{p.name}</td>
                <td className="border px-3 py-2">{p.vendorId?.name}</td>
                <td className="border px-3 py-2">{p.categoryId?.name}</td>
                <td className="border px-3 py-2">₹{p.price}</td>
                <td className="border px-3 py-2">
                  <StatusBadge status={p.isActive ? "active" : "inactive"} />
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => toggleStatus(p._id)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      p.isActive
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
