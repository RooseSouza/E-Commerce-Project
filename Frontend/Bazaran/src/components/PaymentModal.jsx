import React, { useState } from "react";
import axios from "axios";

const PaymentModal = ({ isOpen, onClose, orderId }) => {
  const [loading, setLoading] = useState(false);

  const handleDummyPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/payments/dummy`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment successful!");
      onClose();
      window.location.href = "/home"; // redirect after payment
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Dummy Payment Page</h2>
        <p className="mb-6">Click the button below to make a dummy payment</p>
        <button
          onClick={handleDummyPayment}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-bold text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Make Dummy Payment"}
        </button>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
