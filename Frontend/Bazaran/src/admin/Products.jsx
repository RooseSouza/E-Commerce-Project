import { useEffect, useState } from "react"; 
import axios from "axios";
import StatusBadge from "../components/AdminStatusBadge";

const API = import.meta.env.VITE_API_BASE;
const PRODUCTS_PER_PAGE = 6;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    // Optimistic UI
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, isActive: !p.isActive } : p
      )
    );

    try {
      await axios.patch(`${API}/api/admin/products/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Toggle error", err);
      // revert if fails
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isActive: !p.isActive } : p
        )
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <div className="bg-white rounded-2xl border shadow-lg p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
        <p className="text-sm text-gray-500">
          Manage product availability and status
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">

          {/* Header */}
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <th className="px-4 py-3 text-left font-semibold">Sr.No</th>
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">Vendor</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {currentProducts.map((p, index) => (
              <tr
                key={p._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition"
              >
                <td className="px-4 py-3 font-medium text-gray-700">{startIndex + index + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.vendorId?.name || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{p.categoryId?.name || "-"}</td>
                <td className="px-4 py-3 font-medium text-gray-700">₹{p.price}</td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={p.isActive} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(p._id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition
                      ${p.isActive
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                  >
                    {p.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length > PRODUCTS_PER_PAGE && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
