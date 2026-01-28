const ProductsList = ({ products, onEdit, onDelete, onToggle }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      {products.length === 0 && <p>No products found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white shadow rounded p-4 flex flex-col">
            <img src={p.image.url} className="h-40 object-cover rounded mb-2" />
            <h3 className="font-bold">{p.name}</h3>
            <p>{p.categoryId?.name}</p>
            <p>₹{p.price}</p>
            <p>
              Stock: {p.stock.quantity} {p.stock.unit}
            </p>
            <p className={p.isActive ? "text-green-600" : "text-red-600"}>
              {p.isActive ? "Active" : "Disabled"}
            </p>

            <div className="mt-auto flex gap-2">
              <button onClick={() => onEdit(p)} className="bg-yellow-500 text-white p-1 rounded flex-1">
                Edit
              </button>
              <button onClick={() => onDelete(p._id)} className="bg-red-500 text-white p-1 rounded flex-1">
                Delete
              </button>
              <button
                onClick={() => onToggle(p._id)}
                className="bg-gray-600 text-white p-1 rounded flex-1"
              >
                Toggle
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsList;
