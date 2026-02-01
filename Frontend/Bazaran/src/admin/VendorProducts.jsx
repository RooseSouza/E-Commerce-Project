import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const VendorProducts = () => {
  const { vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setProducts(res.data);
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
      alert(err.response?.data?.message || "Action not allowed");
    }
  };

  const updateApproval = async (id, status) => {
  try {
    await axios.patch(
      `${API_BASE}/api/admin/products/${id}/approval`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchProducts();
  } catch (err) {
    alert("Action failed");
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

  const statusBadge = (p) => {
    if (p.stock.quantity === 0)
      return <span className="px-2 py-1 text-xs bg-gray-200 rounded">Disabled</span>;

    if (!p.vendorId?.isApproved)
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Pending</span>;

    if (p.isActive)
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Active</span>;

    return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Disabled</span>;
  };

  const actionButton = (p) => {
    if (p.stock.quantity === 0 || !p.vendorId?.isApproved)
      return (
        <button
          disabled
          className="px-3 py-1 text-xs bg-gray-300 text-gray-600 rounded cursor-not-allowed"
        >
          Enable
        </button>
      );

    return (
      <button
        onClick={() => toggleStatus(p._id)}
        className={`px-3 py-1 text-xs rounded text-white ${
          p.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {p.isActive ? "Disable" : "Enable"}
      </button>
    );
  };

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Vendor Products</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>

                <td className="p-3 flex items-center gap-3">
                  <img
                    src={p.image?.url}
                    alt={p.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span className="font-medium">{p.name}</span>
                </td>

                <td className="p-3">{p.categoryId?.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  {p.stock.quantity} {p.stock.unit}
                </td>
               <td className="p-3">
  {p.approvalStatus === "pending" && (
    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
      Pending Approval
    </span>
  )}

  {p.approvalStatus === "approved" && (
    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
      Approved
    </span>
  )}

  {p.approvalStatus === "rejected" && (
    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
      Rejected
    </span>
  )}
</td>


                <td className="p-3 flex gap-2 justify-center flex-wrap">

  {/* APPROVE / REJECT */}
  {p.approvalStatus === "pending" && (
    <>
      <button
        onClick={() => updateApproval(p._id, "approved")}
        className="px-3 py-1 bg-green-600 text-white rounded text-xs"
      >
        Approve
      </button>

      <button
        onClick={() => updateApproval(p._id, "rejected")}
        className="px-3 py-1 bg-red-600 text-white rounded text-xs"
      >
        Reject
      </button>
    </>
  )}

  {/* ENABLE / DISABLE */}
  {p.approvalStatus === "approved" && p.stock.quantity > 0 && (
    <button
      onClick={() => toggleStatus(p._id)}
      className={`px-3 py-1 text-xs rounded text-white ${
        p.isActive ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {p.isActive ? "Disable" : "Enable"}
    </button>
  )}

  {/* DELETE */}
  <button
    onClick={() => deleteProduct(p._id)}
    className="px-3 py-1 bg-black text-white rounded text-xs"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorProducts;
