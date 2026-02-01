import React from "react";

const ProductList = ({
  products,
  onEdit,
  onDelete,
  onToggle,
  productFilter,
}) => {
  const filteredProducts = products.filter((p) => {
    switch (productFilter) {
      case "active":
        return p.isActive && p.stock?.quantity > 0;
      case "inactive":
        return !p.isActive && p.stock?.quantity > 0;
      case "outOfStock":
        return p.stock?.quantity === 0;
      default:
        return true;
    }
  });

  if (filteredProducts.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">
        No products found for this filter.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => {
        const qty = product.stock?.quantity || 0;
        const unit = product.stock?.unit || "";

        const stockColor =
          qty === 0
            ? "text-red-600"
            : qty <= 5
            ? "text-yellow-600"
            : "text-green-600";

        return (
          <div
            key={product._id}
            className="bg-white rounded-xl border shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative h-44 bg-gray-100">
              <img
                src={product.image?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {qty === 0 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-base truncate">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>

              {/* PRICE + STOCK */}
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-orange-600">
                  ₹{product.price}
                </span>

                <span className={`text-sm font-medium ${stockColor}`}>
                  Stock: {qty} {unit}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="mt-auto pt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="text-sm py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Edit
                </button>

               {/* TOGGLE STATUS */}
{qty === 0 ? (
  <button
    disabled
    className="text-sm py-1.5 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
  >
    Out of Stock
  </button>
) : (
  <button
    onClick={() => onToggle(product._id)}
    className={`text-sm py-1.5 rounded ${
      product.isActive
        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        : "bg-green-100 text-green-700 hover:bg-green-200"
    }`}
  >
    {product.isActive ? "Disable" : "Enable"}
  </button>
)}

                <button
                  onClick={() => onDelete(product._id)}
                  className="text-sm py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
