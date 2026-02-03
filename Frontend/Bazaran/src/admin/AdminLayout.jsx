import { Outlet, NavLink, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const linkBase =
    "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition";

  const activeLink =
    "bg-orange-50 text-orange-600 border border-orange-200";

  const inactiveLink =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ✅ TOP HEADER (FULL WIDTH) */}
      <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
        <h2 className="text-base font-semibold text-orange-600">
          Bazaran
        </h2>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     text-sm font-medium text-white bg-red-500
                     hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* BODY */}
      <div className="flex flex-1">

        {/* ✅ SIDEBAR */}
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
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

        {/* ✅ MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
