import React from "react";

const OrderDetailsModal = ({ order, addresses, onClose }) => {
  const deliveryAddress = addresses.find(
    (addr) => addr._id === order.addressId,
  );

  const TAX_RATE = 0.05;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal >= 499 ? 0 : 40;
  const total = subtotal + tax + shipping;

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        {/* Order Meta */}
        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        {/* Address */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-1">Delivery Address</h3>

          {deliveryAddress ? (
            <p className="text-sm text-gray-700">
              {deliveryAddress.name && (
                <>
                  {deliveryAddress.name}
                  <br />
                </>
              )}
              {deliveryAddress.houseNumber}, {deliveryAddress.street}
              <br />
              {deliveryAddress.city}, {deliveryAddress.state} –{" "}
              {deliveryAddress.zip}
              <br />
              {deliveryAddress.country}
              <br />
              📞 {deliveryAddress.phone}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">Address not found</p>
          )}
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
          <div className="border rounded-md">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between px-4 py-2 border-b last:border-b-0 text-sm"
              >
                <span>
                  {item.productId.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>₹{tax}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>

          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
