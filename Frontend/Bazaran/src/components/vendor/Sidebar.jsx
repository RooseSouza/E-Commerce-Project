import { FiPlusSquare, FiBox, FiLogOut } from "react-icons/fi";

const Sidebar = ({ vendor, setShowAddForm, handleLogout }) => {
  return (
    <aside className="w-64 bg-white shadow flex flex-col">
      <div className="p-6 text-xl font-bold border-b">Vendor Panel</div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex gap-2 items-center p-2 rounded hover:bg-gray-200"
        >
          <FiPlusSquare /> Add Product
        </button>

        <button
          onClick={() => setShowAddForm(false)}
          className="w-full flex gap-2 items-center p-2 rounded hover:bg-gray-200"
        >
          <FiBox /> My Products
        </button>
      </nav>

      <div className="p-4 border-t flex justify-between items-center">
        <span className="text-sm">{vendor?.name}</span>
        <button onClick={handleLogout} className="text-red-600">
          <FiLogOut />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
