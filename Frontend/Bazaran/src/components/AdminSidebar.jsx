import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const linkBase =
    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition";

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm flex flex-col">
      
      {/* Logo / Title */}
      <div className="px-6 py-5 border-b">
        <h2 className="text-xl font-bold text-gray-900">
        Bazaran
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Management Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/admin"
          className={`${linkBase} ${
            isActive("/admin") && !isActive("/admin/vendors") && !isActive("/admin/users") && !isActive("/admin/products")
              ? "bg-orange-50 text-orange-600 border border-orange-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/vendors"
          className={`${linkBase} ${
            isActive("/admin/vendors")
              ? "bg-orange-50 text-orange-600 border border-orange-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Vendors
        </Link>

        <Link
          to="/admin/users"
          className={`${linkBase} ${
            isActive("/admin/users")
              ? "bg-orange-50 text-orange-600 border border-orange-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Users
        </Link>

        <Link
          to="/admin/products"
          className={`${linkBase} ${
            isActive("/admin/products")
              ? "bg-orange-50 text-orange-600 border border-orange-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Products
        </Link>
      </nav>

      {/* Footer (optional but professional) */}
      <div className="p-4 border-t text-xs text-gray-400">
        © {new Date().getFullYear()} Admin
      </div>
    </aside>
  );
};

export default AdminSidebar;
