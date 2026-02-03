import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const AdminDashboard = () => {
  const [range, setRange] = useState("week");
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/admin/stats?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADMIN STATS 👉", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("STATS ERROR ❌", err.response?.data || err.message);
    }
  };

  const items = stats
    ? [
        { label: "Users", value: stats.users, color: "bg-blue-500" },
        { label: "Sellers", value: stats.vendors, color: "bg-purple-500" },
        { label: "Products", value: stats.products, color: "bg-green-500" },
      ]
    : [];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
<div className="flex flex-wrap gap-1 bg-white rounded-lg shadow p-1">
         {["day", "week", "month", "total"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-sm rounded-md transition
                ${range === r
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS */}
      {!stats ? (
        <div className="text-gray-500 text-center py-10">
          Loading statistics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="text-sm text-gray-500">{item.label}</div>

              <div className="mt-2 text-3xl font-bold">
                {item.value}
              </div>

              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`${item.color} h-full`}
                  style={{ width: `${Math.min(item.value * 5, 100)}%` }}
                />
              </div>

              <div className="mt-3 text-xs text-green-600 font-medium">
                Updated this {range}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
