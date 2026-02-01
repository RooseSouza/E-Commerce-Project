import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddAddressModal from "../components/AddAddressModal";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();
  const { fetchNotifications } = useNotifications();

  /* ================= CART ================= */
  const fetchCart = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setCartItems((data.items || []).filter((item) => item.productId));
  };

  /* ================= ADDRESSES ================= */
  const fetchAddresses = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setAddresses(data.addresses || []);
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  /* ================= TOTALS ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => (item.productId ? sum + item.productId.price * item.quantity : sum),
    0
  );
  const shipping = subtotal >= 499 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
  if (selectedAddressIndex === null) return;

  const selectedAddress = addresses[selectedAddressIndex];

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        address: selectedAddress,
        items: cartItems.filter((item) => item.productId).map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        subtotal,
        shipping,
        tax,
        total,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Order failed");

    // Instead of redirecting, open payment modal
    setCurrentOrderId(data._id || data.order?._id); // save order ID
    alert("Order placed successfully 🎉");
      fetchNotifications();
      navigate("/home"); // ✅ redirect to homepage
  } catch (err) {
    console.error(err);
    alert(err.message || "Order placement failed!");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================= LEFT: ADDRESS ================= */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Select Delivery Address</h2>
              <button
                onClick={() => setShowAddAddress(true)}
                className="text-blue-600 font-semibold"
              >
                + Add New Address
              </button>
            </div>

            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((addr, index) => (
                  <label
                    key={index}
                    className={`block border rounded-lg p-4 cursor-pointer ${
                      selectedAddressIndex === index
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mr-3"
                      checked={selectedAddressIndex === index}
                      onChange={() => setSelectedAddressIndex(index)}
                    />
                    <span className="font-semibold">{addr.name}</span>
                    <p className="text-sm text-gray-700">
                      {addr.houseNumber}, {addr.street}, {addr.city},{" "}
                      {addr.state} - {addr.zip}
                    </p>
                    <p className="text-sm">📞 {addr.phone}</p>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No address saved yet.</p>
            )}
          </div>

          {/* ================= RIGHT: SUMMARY ================= */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              {cartItems.filter(item => item.productId).map(item => (
                <div key={item.productId._id} className="flex justify-between">
                  <span>
                    {item.productId.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{(item.productId.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              disabled={selectedAddressIndex === null}
              onClick={placeOrder}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-white ${
                selectedAddressIndex === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* ADD ADDRESS MODAL */}
      {showAddAddress && (
        <AddAddressModal
          isOpen={showAddAddress}
          onClose={() => setShowAddAddress(false)}
          onSave={async (data) => {
            await fetch(`${import.meta.env.VITE_API_BASE}/api/users/me/address`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(data),
            });
            setShowAddAddress(false);
            fetchAddresses();
          }}
        />
      )}

      
    </div>
  );
};

export default Checkout;
