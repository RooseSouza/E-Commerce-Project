import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

// Helper function to get badge classes based on order status
const getStatusClasses = (status) => {
  switch (status) {
    case "placed":
      return "bg-gray-200 text-gray-800";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "dispatched":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setOrders(res.data);
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders received yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Sr.No</th>
                <th className="border px-3 py-2">Customer</th>
                <th className="border px-3 py-2">Address</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Products</th>
                <th className="border px-3 py-2">Total</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const orderNumber = index + 1;

                // Find the address used for this order
                const address = order.userId?.addresses?.find(
                  (addr) => addr._id.toString() === order.addressId.toString()
                );

                // Calculate subtotal, tax, delivery, grand total
                const subtotal = order.items.reduce(
                  (sum, item) => sum + item.productId.price * item.quantity,
                  0
                );
                const tax = Math.round(subtotal * 0.05);
                const deliveryCharge = subtotal >= 499 ? 0 : 40;
                const grandTotal = subtotal + tax + deliveryCharge;

                return (
                  <tr key={order._id} className="border">
                    <td className="border px-3 py-2">{orderNumber}</td>
                    <td className="border px-3 py-2">{order.userId?.name}</td>
                   <td className="border px-3 py-2">
  {order.userId?.selectedAddress ? (
    <div className="flex flex-col">
      <span>
        {order.userId.selectedAddress.houseNumber}, {order.userId.selectedAddress.street}, {order.userId.selectedAddress.city}, {order.userId.selectedAddress.state} - {order.userId.selectedAddress.zip}, {order.userId.selectedAddress.country}
      </span>
      <span className="text-black-500">📞 {order.userId.selectedAddress.phone}</span>
    </div>
  ) : (
    <span className="text-gray-400">N/A</span>
  )}
</td>

                    <td className="border px-3 py-2">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="border px-3 py-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.productId.name} × {item.quantity} (₹{item.productId.price})
                          </span>
                          <span>₹{item.productId.price * item.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td className="border px-3 py-2">
                      <div>Subtotal: ₹{subtotal}</div>
                      <div>Tax (5%): ₹{tax}</div>
                      <div>Delivery: ₹{deliveryCharge}</div>
                      <div className="font-semibold">Total: ₹{grandTotal}</div>
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
