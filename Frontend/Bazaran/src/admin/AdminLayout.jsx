import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const linkBase =
    "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition";

  const activeLink =
    "bg-orange-50 text-orange-600 border border-orange-200";

  const inactiveLink =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-orange-600">
           Bazaran
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Management Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="vendors"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Vendors
          </NavLink>

          <NavLink
            to="users"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="products"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Products
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-xs text-gray-400">
          © {new Date().getFullYear()} Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
