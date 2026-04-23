import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderDetailsModal from "../components/OrderDetailsModal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/users/me/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        const fetchedOrders = data.orders || [];
        setOrders(fetchedOrders);
        setAddresses(data.user?.addresses || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");
    if (orderId && orders.length > 0) {
      const targetOrder = orders.find((o) => o._id === orderId);
      if (targetOrder) setSelectedOrder(targetOrder);
    }
  }, [location.search, orders]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-[90rem] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Orders
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-semibold">
                        Order #{index + 1}
                      </td>

                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 font-medium">
                        ₹{order.totalAmount}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No orders found
            </p>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          addresses={addresses}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default OrdersPage;
