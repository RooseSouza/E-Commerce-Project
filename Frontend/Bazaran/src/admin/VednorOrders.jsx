import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const VendorOrders = () => {
  const { vendorId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/admin/vendors/${vendorId}/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Vendor Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Products</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-xs">
                    {order._id}
                  </td>

                  <td className="border px-4 py-2">
                    {order.userId?.name}
                    <div className="text-xs text-gray-500">
                      {order.userId?.email}
                    </div>
                  </td>

                  <td className="border px-4 py-2">
                    {order.items
                      .filter((i) => i.vendorId === vendorId)
                      .map((item) => (
                        <div key={item._id}>
                          {item.productId?.name} × {item.quantity}
                        </div>
                      ))}
                  </td>

                  <td className="border px-4 py-2 font-semibold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="border px-4 py-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {order.status}
                    </span>
                  </td>

                  <td className="border px-4 py-2 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default VendorOrders;
