import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "../components/AdminStatusBadge";

const API = import.meta.env.VITE_API_BASE;
const PRODUCTS_PER_PAGE = 6;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const token = localStorage.getItem("token");

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/admin/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- CATEGORY LIST ---------------- */
  const categories = [
    ...new Map(
      products
        .filter((p) => p.categoryId)
        .map((p) => [p.categoryId._id, p.categoryId])
    ).values(),
  ];

  /* ---------------- FILTER ---------------- */
  const isFilterApplied = Boolean(selectedCategory);

  const filteredProducts = isFilterApplied
    ? products.filter(
        (p) => p.categoryId?._id === selectedCategory
      )
    : [];

  const productCount = filteredProducts.length;

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(productCount / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  /* ---------------- STOCK BADGE ---------------- */
  const renderStockBadge = (stock) => {
    const qty = stock?.quantity ?? 0;
    const unit = stock?.unit || "";

    if (qty === 0) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-semibold">
          Out of stock
        </span>
      );
    }

    if (qty < 5) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-semibold">
          Low ({qty} {unit})
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
        In stock ({qty} {unit})
      </span>
    );
  };

  /* ---------------- STATUS TOGGLE ---------------- */
  const toggleStatus = async (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, isActive: !p.isActive } : p
      )
    );

    await axios.patch(
      `${API}/api/admin/products/${id}/toggle`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className="bg-white rounded-2xl border shadow-lg p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      {/* CATEGORY FILTER */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded-lg text-sm w-64"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* EMPTY STATE */}
      {!isFilterApplied && (
        <div className="text-center py-14 text-gray-500">
          Please select a <b>category</b> to view products
        </div>
      )}

      {/* PRODUCT COUNT */}
      {isFilterApplied && (
        <div className="mb-4 text-sm font-semibold text-indigo-600">
          Total products in this category: {productCount}
        </div>
      )}

      {/* TABLE */}
      {isFilterApplied && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-indigo-500 text-white text-left">
                <th className="px-4 py-3 w-12">SR NO</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Seller Name</th>
                <th className="px-4 py-3">Seller Mobile</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock Quantity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((p, i) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {startIndex + i + 1}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {p.name}
                  </td>

                  <td className="px-4 py-3">
                    {p.vendorId?.name || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {p.vendorId?.phone || "—"}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    ₹{p.price}
                  </td>

                  <td className="px-4 py-3">
                    {renderStockBadge(p.stock)}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge isActive={p.isActive} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(p._id)}
                      className={`px-3 py-1 text-xs rounded-lg font-semibold text-white ${
                        p.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {p.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}

              {productCount === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-500"
                  >
                    No products found in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {isFilterApplied && productCount > PRODUCTS_PER_PAGE && (
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

export default Products;
