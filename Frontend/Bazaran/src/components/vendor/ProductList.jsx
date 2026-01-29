
const ProductList = ({ products, onEdit, onDelete, onToggle }) => {
  if (!products.length) {
    return <p className="text-gray-500">No products found.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow rounded p-4 flex flex-col"
          >
            <img
              src={product.image?.url}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-2"
            />

            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500">
              Category: {product.categoryId?.name}
            </p>
            <p className="text-sm">₹ {product.price}</p>
            <p className="text-sm">
              Stock: {product.stock?.quantity} {product.stock?.unit}
            </p>

            {/* STATUS */}
            <span
              className={`mt-1 text-sm font-medium ${
                product.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              Status: {product.isActive ? "Active" : "Disabled"}
            </span>

            {/* ACTIONS */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => onToggle(product._id)}
                className={`flex-1 py-1 rounded text-white ${
                  product.isActive
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {product.isActive ? "Disable" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
