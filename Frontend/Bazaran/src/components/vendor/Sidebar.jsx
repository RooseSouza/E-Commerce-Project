const Sidebar = ({ vendor, setView, handleLogout }) => {
  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
      {/* Logo / Title */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Bazaran</h1>
        <p className="text-xs text-gray-500 mt-1">Vendor Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => setView("list")}
          className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
        >
          📦 My Products
        </button>

        <button
          onClick={() => setView("add")}
          className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
        >
          ➕ Add Product
        </button>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {vendor?.name}
          </p>
          <p className="text-xs text-gray-500">Vendor</p>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
