const Sidebar = ({ vendor, setView, currentView }) => {

  const menuClass = (view) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       currentView === view
         ? "bg-orange-500 text-white shadow"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
    
      {/*  Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => setView("dashboard")}
          className={menuClass("dashboard")}
        >
          Dashboard
        </button>

        <button
          onClick={() => setView("list")}
          className={menuClass("list")}
        >
           My Products
        </button>

        <button
          onClick={() => setView("add")}
          className={menuClass("add")}
        >
           Add Product
        </button>

        <button
          onClick={() => setView("orders")}
          className={menuClass("orders")}
        >
          Orders
        </button>
      </nav>

      {/*  Footer Hint */}
      <div className="px-6 py-4 border-t text-xs text-gray-400">
        © {new Date().getFullYear()} Bazaran
      </div>
    </aside>
  );
};

export default Sidebar;
