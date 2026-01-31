import React from "react";
import jsPDF from "jspdf";
import { robotoBase64 } from "../utils/fonts/robotoBase64";


const OrderDetailsModal = ({ order, addresses, onClose }) => {
  if (!order) return null;

  const deliveryAddress = addresses.find(
    (addr) => addr._id === order.addressId
  );

  const TAX_RATE = 0.05;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal >= 499 ? 0 : 40;
  const total = subtotal + tax + shipping;

  /* 📄 DOWNLOAD INVOICE */
  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    let y = 20;

    const orderDate = new Date(order.createdAt)
      .toISOString()
      .split("T")[0];

    doc.setFontSize(18);
    doc.text("INVOICE", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(11);
    doc.text(`Order Date: ${orderDate}`, 14, y);
    y += 6;
    doc.text(`Order Status: ${order.status}`, 14, y);
    y += 10;

    doc.setFontSize(13);
    doc.text("Delivery Address", 14, y);
    y += 6;

    doc.setFontSize(11);
    if (deliveryAddress) {
      doc.text(
        `${deliveryAddress.name || ""}\n${deliveryAddress.houseNumber}, ${deliveryAddress.street
        }\n${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.zip
        }\n${deliveryAddress.country}\nPhone: ${deliveryAddress.phone
        }`,
        14,
        y
      );
      y += 30;
    }

    doc.setFontSize(13);
    doc.text("Items", 14, y);
    y += 6;

    doc.setFontSize(11);
    order.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.productId.name} × ${item.quantity
        } — ₹${item.price * item.quantity}`,
        14,
        y
      );
      y += 6;
    });

    y += 6;
    doc.line(14, y, 196, y);
    y += 6;

    doc.text(`Subtotal: ₹${subtotal}`, 140, y);
    y += 6;
    doc.text(`Tax (5%): ₹${tax}`, 140, y);
    y += 6;
    doc.text(`Shipping: ${shipping === 0 ? "FREE" : `₹${shipping}`}`, 140, y);
    y += 6;

    doc.setFontSize(13);
    doc.text(`Total: ₹${total}`, 140, y);

    doc.save(`invoice-${orderDate}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Order Details</h2>
        </div>

        {/* Meta */}
        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        {/* Address */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Delivery Address</h3>

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
            <p className="text-sm italic text-gray-500">Address not found</p>
          )}
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items</h3>
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

        {/* Summary */}
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
        <div className="mt-6 flex justify-end">
          <button
            onClick={downloadInvoice}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
