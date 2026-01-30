const DashBoardCard = ({ products }) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => p.stock?.quantity === 0).length;

  const Card = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4 hover:shadow-md transition">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card
        title="Total Products"
        value={totalProducts}
        color="bg-orange-100 text-orange-600"
      />

      <Card
        title="Active Products"
        value={activeProducts}
        color="bg-green-100 text-green-600"
      />

      <Card
        title="Out of Stock"
        value={outOfStock}
        color="bg-red-100 text-red-600"
      />
    </div>
  );
};

export default DashBoardCard;
