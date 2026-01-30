import React from "react";

const DashboardHeader = ({ vendor, onProfileClick, onLogout }) => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Left */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
       Vendor
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={onProfileClick}
          className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm"
        >
          My Profile
        </button>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
