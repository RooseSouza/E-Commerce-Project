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

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/vendors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendors(res.data);
    } catch (error) {
      console.error(
        "Fetch vendors error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading vendors...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Registered Vendors</h2>

      {vendors.length === 0 ? (
        <p className="text-gray-500">No vendors found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Vendor Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Products</th>
                <th className="border px-4 py-2 text-center">Action</th>
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
                  <td className="border px-4 py-2">{vendor.phone || "—"}</td>
                  <td className="border px-4 py-2">
                    {vendor.productCount ?? 0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/vendors/${vendor._id}`)
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Products
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

export default Vendors;
