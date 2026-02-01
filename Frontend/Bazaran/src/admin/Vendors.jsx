import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendors();
  }, []);

  // 🔹 Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update vendor from backend response
  const updateVendorState = (updatedVendor) => {
    setVendors((prev) =>
      prev.map((v) => (v._id === updatedVendor._id ? updatedVendor : v))
    );
  };

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/admin/vendors/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateVendorState(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ❌ Reject
  const handleReject = async (id) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/admin/vendors/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateVendorState(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🚫 Block
  const handleBlock = async (id) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/admin/vendors/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateVendorState(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🔓 Unblock
  const handleUnblock = async (id) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/admin/vendors/${id}/unblock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateVendorState(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) {
    return <p className="p-6">Loading vendors...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Registered Vendors</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Products</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor, index) => (
              <tr key={vendor._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>

                <td className="border px-4 py-2 font-medium">
                  {vendor.name}
                </td>

                <td className="border px-4 py-2">{vendor.email}</td>

                <td className="border px-4 py-2">
                  {vendor.productCount ?? 0}
                </td>

                {/* 🔹 STATUS */}
                <td className="border px-4 py-2">
                  {vendor.isBlocked ? (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                      Blocked
                    </span>
                  ) : vendor.isApproved ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                      Pending
                    </span>
                  )}
                </td>

                {/* 🔹 ACTIONS */}
                <td className="border px-4 py-2 text-center space-x-2">
                  {/* Pending */}
                  {!vendor.isApproved && !vendor.isBlocked && (
                    <>
                      <button
                        onClick={() => handleApprove(vendor._id)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(vendor._id)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* Approved */}
                  {vendor.isApproved && !vendor.isBlocked && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/admin/vendors/${vendor._id}`)
                        }
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View Products
                      </button>
              
                      <button
                        onClick={() => handleBlock(vendor._id)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Block
                      </button>
                    </>
                  )}

                  {/* Blocked */}
                  {vendor.isBlocked && (
                    <button
                      onClick={() => handleUnblock(vendor._id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendors;
