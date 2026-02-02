import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-5 font-bold text-xl border-b">
          Admin Panel
        </div>

        <nav className="p-4 space-y-3">
          <NavLink to="dashboard" className="block hover:text-blue-600">
            Dashboard
          </NavLink>
          <NavLink to="vendors" className="block hover:text-blue-600">
            Vendors
          </NavLink>
          <NavLink to="users" className="block hover:text-blue-600">
            Users
          </NavLink>
          <NavLink to="products" className="block hover:text-blue-600">
            Products
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
