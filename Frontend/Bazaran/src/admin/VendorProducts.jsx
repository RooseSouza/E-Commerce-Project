import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const PRODUCTS_PER_PAGE = 6;

const VendorProducts = () => {
  const { vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/admin/vendors/${vendorId}/products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `${API_BASE}/api/admin/products/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  if (loading)
    return <p className="p-6 text-gray-500">Loading vendor products...</p>;

  return (
    <div className="bg-white rounded-2xl border shadow-lg p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Seller Products</h2>
        <p className="text-sm text-gray-500">
          Manage product status and stock
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <th className="px-4 py-3 text-left">Sr.No</th>
              <th className="px-4 py-3 text-left">Product Name</th>
              <th className="px-4 py-3 text-left">Category Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock Quantity</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((p, i) => (
              <tr key={p._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-3">
                  {startIndex + i + 1}
                </td>

                <td className="px-4 py-3 font-semibold flex items-center gap-3">
                  {p.image?.url && (
                    <img
                      src={p.image.url}
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  {p.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {p.categoryId?.name || "—"}
                </td>

                <td className="px-4 py-3 font-medium">
                  ₹{p.price}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {p.stock?.quantity} {p.stock?.unit}
                </td>

                <td className="px-4 py-3">
                  {p.isActive ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-semibold">
                      Disabled
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => toggleStatus(p._id)}
                    disabled={p.stock?.quantity === 0}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white
                      ${
                        p.stock?.quantity === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : p.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    {p.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-black text-white hover:bg-gray-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {currentProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {products.length > PRODUCTS_PER_PAGE && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-1.5 bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-1.5 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
