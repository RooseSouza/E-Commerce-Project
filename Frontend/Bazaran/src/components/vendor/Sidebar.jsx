import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // hamburger & close icons

const Sidebar = ({ vendor, setView, currentView }) => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu open/close

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const menuClass = (view) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       currentView === view
         ? "bg-orange-500 text-white shadow"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 border-b">
        <div className="font-bold text-xl">{vendor?.name || "Vendor"}</div>
        <button onClick={toggleMenu}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-full bg-white border-r z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          w-64 flex flex-col
        `}
      >

        {/* Menu */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-2">
          <button onClick={() => setView("dashboard")} className={menuClass("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setView("list")} className={menuClass("list")}>
            My Products
          </button>

          <button onClick={() => setView("add")} className={menuClass("add")}>
            Add Product
          </button>

          <button onClick={() => setView("orders")} className={menuClass("orders")}>
            Orders
          </button>
        </nav>

        {/* Footer - hidden on mobile */}
        <div className="hidden md:block px-6 py-4 border-t text-xs text-gray-400">
          © {new Date().getFullYear()} Bazaran
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
