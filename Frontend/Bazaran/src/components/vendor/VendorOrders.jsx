import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const VendorOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${API_BASE}/api/orders/vendor`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders received yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <span>Order #{order._id.slice(-6)}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="text-sm">
                <strong>Customer:</strong> {order.userId?.name}
              </div>

              <div className="text-sm">
                <strong>Products:</strong>
                {order.items.map((item) => (
                  <div key={item._id} className="ml-4">
                    {item.productId?.name} × {item.quantity}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold">
                  Total: ₹{order.totalAmount}
                </span>

                <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
