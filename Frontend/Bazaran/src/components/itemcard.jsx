import React from 'react';

const ItemCard = ({ product }) => {
  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm line-through text-gray-500">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
        <button 
          onClick={handleAddToCart}
          className="w-full bg-green-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
