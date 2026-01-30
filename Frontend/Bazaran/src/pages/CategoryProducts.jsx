import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const CategoryProducts = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const categoryId = searchParams.get("id");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE}/api/products`;
        
        if (searchQuery) {
          // Use search endpoint if search query exists
          url = `${API_BASE}/api/products/search?q=${searchQuery}`;
        } else if (categoryId && categoryId !== "undefined") {
          // Filter by category ID if present
          url = `${API_BASE}/api/products?categoryId=${categoryId}`;
        } else if (category && category !== "undefined") {
          // Fallback: Filter by category name
          url = `${API_BASE}/api/products?category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          const mappedProducts = data.map((product) => ({
            id: product._id,
            name: product.name,
            category: product.categoryId?.name || "Unknown",
            price: product.price,
            image: product.image?.url || "https://via.placeholder.com/300",
          }));
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, categoryId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
        {category ? category : (searchQuery ? `Search Results: "${searchQuery}"` : "All Products")}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1 capitalize">{product.category}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-orange-600 font-bold">₹{product.price}</p>
                  <button 
                    className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          )}
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryProducts;