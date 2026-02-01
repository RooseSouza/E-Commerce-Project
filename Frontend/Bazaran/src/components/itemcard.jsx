import React from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const ItemCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id || product.id, quantity: 1 }),
      });

      const data = await response.json();
      alert(response.ok ? "Item added to cart!" : data.message || "Failed to add to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
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
