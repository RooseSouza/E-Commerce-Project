import React from "react";

const DashBoardCards = ({
  products = [],
  orders = [],
  onProductCardClick,
  onOrderCardClick,
  activeProductFilter,
  activeOrderFilter
}) => {
  /* ---------------- PRODUCT COUNTS ---------------- */
  const productStats = {
    total: products.length,
    active: products.filter(p => p.isActive && p.stock?.quantity > 0).length,
    inactive: products.filter(p => !p.isActive && p.stock?.quantity > 0).length,
    outOfStock: products.filter(p => p.stock?.quantity === 0).length
  };

  /* ---------------- ORDER COUNTS ---------------- */
  const orderStats = {
    total: orders.length,
    placed: orders.filter(o => o.status === "placed").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    dispatched: orders.filter(o => o.status === "dispatched").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length
  };

  /* ---------------- CARD ---------------- */
  const Card = ({ title, value, color, onClick, active }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition text-center ${
        active ? "ring-2 ring-orange-400" : ""
      }`}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold ${color}`}>
        {value}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );

  return (
    <div className="space-y-10">

      {/* ================= PRODUCTS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Products Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Card
            title="Total Products"
            value={productStats.total}
            color="bg-orange-100 text-orange-600"
            active={activeProductFilter === "total"}
            onClick={() => onProductCardClick("total")}
          />
          <Card
            title="Active Products"
            value={productStats.active}
            color="bg-green-100 text-green-600"
            active={activeProductFilter === "active"}
            onClick={() => onProductCardClick("active")}
          />
          <Card
            title="Inactive Products"
            value={productStats.inactive}
            color="bg-yellow-100 text-yellow-600"
            active={activeProductFilter === "inactive"}
            onClick={() => onProductCardClick("inactive")}
          />
          <Card
            title="Out of Stock"
            value={productStats.outOfStock}
            color="bg-red-100 text-red-600"
            active={activeProductFilter === "outOfStock"}
            onClick={() => onProductCardClick("outOfStock")}
          />
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Orders Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <Card
  title="Total Orders"
  value={orderStats.total}
  color="bg-gray-100 text-gray-700"
  active={activeOrderFilter === "all"}
  onClick={() => onOrderCardClick("all")}
/>

          <Card
            title="Placed"
            value={orderStats.placed}
            color="bg-gray-200 text-gray-800"
            active={activeOrderFilter === "placed"}
            onClick={() => onOrderCardClick("placed")}
          />
          <Card
            title="Confirmed"
            value={orderStats.confirmed}
            color="bg-blue-100 text-blue-700"
            active={activeOrderFilter === "confirmed"}
            onClick={() => onOrderCardClick("confirmed")}
          />
          <Card
            title="Dispatched"
            value={orderStats.dispatched}
            color="bg-yellow-100 text-yellow-700"
            active={activeOrderFilter === "dispatched"}
            onClick={() => onOrderCardClick("dispatched")}
          />
          <Card
            title="Delivered"
            value={orderStats.delivered}
            color="bg-green-100 text-green-700"
            active={activeOrderFilter === "delivered"}
            onClick={() => onOrderCardClick("delivered")}
          />
          <Card
            title="Cancelled"
            value={orderStats.cancelled}
            color="bg-red-100 text-red-700"
            active={activeOrderFilter === "cancelled"}
            onClick={() => onOrderCardClick("cancelled")}
          />
        </div>
      </div>

    </div>
  );
};

export default DashBoardCards;
