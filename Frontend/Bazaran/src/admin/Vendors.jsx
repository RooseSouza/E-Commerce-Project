import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const PER_PAGE = 6;

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFE STATE UPDATE ================= */
  const updateVendorById = (id, changes) => {
    setVendors((prev) =>
      prev.map((v) => (v._id === id ? { ...v, ...changes } : v))
    );
  };

  /* ================= ACTIONS ================= */
  const handleApprove = async (id) => {
    await axios.patch(
      `${API_BASE}/api/admin/vendors/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    updateVendorById(id, { isApproved: true, isBlocked: false });
  };

  const handleReject = async (id) => {
    await axios.patch(
      `${API_BASE}/api/admin/vendors/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    updateVendorById(id, { isApproved: false });
  };

  const handleBlock = async (id) => {
    await axios.patch(
      `${API_BASE}/api/admin/vendors/${id}/block`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    updateVendorById(id, { isBlocked: true });
  };

  const handleUnblock = async (id) => {
    await axios.patch(
      `${API_BASE}/api/admin/vendors/${id}/unblock`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    updateVendorById(id, { isBlocked: false });
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(vendors.length / PER_PAGE);
  const startIndex = (page - 1) * PER_PAGE;
  const currentVendors = vendors.slice(startIndex, startIndex + PER_PAGE);

  if (loading) return <p className="p-6 text-gray-500">Loading vendors...</p>;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Registered Seller
        </h2>
        <p className="text-sm text-gray-500">
          Manage Seller approvals and access
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="text-left text-gray-500">
            <tr className="bg-gradient-to-r from-bbg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <th className="px-4 py-2">Sr.No</th>
              <th className="px-4 py-2">Seller Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2 text-center">Total Product</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentVendors.map((vendor, i) => (
              <tr
                key={vendor._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition"
              >
                <td className="px-4 py-3 font-medium text-gray-600">
                  {startIndex + i + 1}
                </td>

                <td className="px-4 py-3 font-semibold text-gray-800">
                  {vendor.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {vendor.email}
                </td>

                <td className="px-4 py-3 text-center font-medium">
                  {vendor.productCount ?? 0}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
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

                {/* Actions */}
                <td className="px-4 py-3 text-center space-x-2">
                  {!vendor.isApproved && !vendor.isBlocked && (
                    <>
                      <button
                        onClick={() => handleApprove(vendor._id)}
                        className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(vendor._id)}
                        className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {vendor.isApproved && !vendor.isBlocked && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/admin/vendors/${vendor._id}`)
                        }
                        className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        View Products
                      </button>
                      <button
                        onClick={() => handleBlock(vendor._id)}
                        className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Block
                      </button>
                    </>
                  )}

                  {vendor.isBlocked && (
                    <button
                      onClick={() => handleUnblock(vendor._id)}
                      className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {currentVendors.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No Seller found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {vendors.length > PER_PAGE && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
