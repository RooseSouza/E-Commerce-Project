import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-yellow-400">Admin Panel</h2>
      <nav className="flex-1 space-y-4">
        <Link
          to="/admin"
          className={`block px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition ${
            isActive("/admin") ? "bg-yellow-400 text-gray-900" : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/vendors"
          className={`block px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition ${
            isActive("/admin/vendors") ? "bg-yellow-400 text-gray-900" : ""
          }`}
        >
          Vendors
        </Link>

          <Link
          to="/admin/users"
          className={`block px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition ${
            isActive("/admin/users") ? "bg-yellow-400 text-gray-900" : ""
          }`}
        >
          Users
        </Link>
        <Link
          to="/admin/products"
          className={`block px-4 py-2 rounded hover:bg-yellow-500 hover:text-gray-900 transition ${
            isActive("/admin/products") ? "bg-yellow-400 text-gray-900" : ""
          }`}
        >
          Products
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
