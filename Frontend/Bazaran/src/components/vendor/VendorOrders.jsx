import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const getStatusClasses = (status) => {
  switch (status) {
    case "placed":
      return "bg-gray-100 text-gray-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "dispatched":
      return "bg-yellow-100 text-yellow-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getNextActions = (status) => {
  switch (status) {
    case "placed":
      return ["confirmed", "cancelled"];
    case "confirmed":
      return ["dispatched", "cancelled"];
    case "dispatched":
      return ["delivered", "cancelled"];
    default:
      return [];
  }
};

const VendorOrders = ({orderFilter = "all" }) => {
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
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch {
      alert("Failed to update order status");
    }
  };

  const filteredOrders =
  orderFilter === "all"
    ? orders
    : orders.filter(o => o.status === orderFilter);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredOrders.map((order, index) => {
        const address = order.userId?.selectedAddress;

        const subtotal = order.items.reduce(
          (sum, item) => sum + item.productId.price * item.quantity,
          0
        );
        const tax = Math.round(subtotal * 0.05);
        const deliveryCharge = subtotal >= 499 ? 0 : 40;
        const grandTotal = subtotal + tax + deliveryCharge;

        return (
          <div
            key={order._id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition flex flex-col"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start p-4 border-b">
              <div>
                <h3 className="font-semibold">Order #{index + 1}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusClasses(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* CUSTOMER */}
            <div className="p-4 text-sm space-y-1">
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {order.userId?.name}
              </p>
              {address && (
                <>
                  <p className="text-gray-600">
                    {address.houseNumber}, {address.street}, {address.city},{" "}
                    {address.state} - {address.zip}, {address.country}
                  </p>
                  <p className="text-gray-500">📞 {address.phone}</p>
                </>
              )}
            </div>

            {/* PRODUCTS */}
            <div className="px-4">
              <h4 className="font-medium text-sm mb-2">Products</h4>
              <div className="space-y-1 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {item.productId.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{item.productId.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="px-4 mt-3 text-sm border-t pt-3 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-orange-600">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="p-4 border-t mt-auto">
              {["delivered", "cancelled"].includes(order.status) ? (
                <span
                  className={`block text-center text-xs font-semibold px-3 py-2 rounded ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status === "delivered"
                    ? "Completed"
                    : "Cancelled"}
                </span>
              ) : (
                <div className="flex justify-center gap-2">
                  {getNextActions(order.status).map((action) => (
                    <button
                      key={action}
                      onClick={() =>
                        handleStatusChange(order._id, action)
                      }
                      className={`px-3 py-2 text-xs rounded font-medium ${
                        action === "cancelled"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : action === "dispatched"
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {action.charAt(0).toUpperCase() +
                        action.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VendorOrders;
