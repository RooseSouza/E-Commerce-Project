const ProductList = ({ products, onEdit, onDelete, onToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">My Products</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={p.image?.url}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span className="font-medium">{p.name}</span>
                </td>

                <td className="p-3 text-center">₹{p.price}</td>

                <td className="p-3 text-center">
                  {p.stock?.quantity} {p.stock?.unit}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        p.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {p.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-3 py-1 rounded bg-blue-500 text-white text-xs"
                  >
                    Edit
                  </button>

                 <button
                onClick={() => onToggle(p._id)}
                className={`px-3 py-1 rounded bg-green-500 text-white text-xs ${
                  p.isActive
                    ? "bg-gray-500 hover:bg-gray-500"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {p.isActive ? "Disable" : "Activate"}
              </button>

                  <button
                    onClick={() => onDelete(p._id)}
                    className="px-3 py-1 rounded bg-red-500 text-white text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
